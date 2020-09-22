import mongoose, { DocumentQuery } from 'mongoose';
import { Next, Request, Response } from 'restify';
import { NotFoundError } from 'restify-errors';
import { Router } from './Router';

export abstract class ModelRouter<T extends mongoose.Document> extends Router {
  basePath: string;
  pageSize: number = 2;

  constructor(protected model: mongoose.Model<T>) {
    super();
    this.basePath = `/api/${model.collection.name}`;
  }

  protected prepareOne(query: DocumentQuery<T | null, T>): DocumentQuery<T | null, T> {
    return query;
  }

  envelop(document: any): any {
    let resource = Object.assign({ _links: {} }, document.toJSON());
    resource._links.self = `${this.basePath}/${resource._id}`;
    return resource;
  }

  envelopAll(documents: any[], options: any = {}): any {
    const resource: any = {
      _links: {
        self: options.url,
      },
      total: options.total,
      items: documents,
    };

    if (options.page && options.total && options.pageSize) {
      if (options.page > 1) {
        resource._links.back = `${this.basePath}?_page=${options.page - 1}`;
      }

      const remaining = options.total - options.page * options.pageSize;

      if (remaining > 0) {
        resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
      }
    }

    console.log(resource, options);

    return resource;
  }

  validateId = (req: Request, resp: Response, next: Next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Document no t found'));
    } else {
      next();
    }
  };

  findAll = async (req: Request, resp: Response, next: Next) => {
    let page = parseInt(req.query._page || 1);

    page = page > 0 ? page : 1;

    const skip = (page - 1) * this.pageSize;

    const total = await this.model.countDocuments().exec();
    const users = await this.model.find().limit(this.pageSize).skip(skip);
    this.renderAll(resp, next, { page, total, pageSize: this.pageSize, url: req.url })(users);
  };

  findById = async (req: Request, resp: Response, next: Next) => {
    const result = await this.prepareOne(this.model.findById(req.params.id));
    this.render(resp, next)(result);
  };

  save = async (req: Request, resp: Response, next: Next) => {
    const modelToSave = new this.model(req.body);
    const result = await modelToSave.save();
    this.render(resp, next)(result);
  };

  replace = async (req: Request, resp: Response, next: Next) => {
    const query = this.model.updateOne({ _id: req.params.id }, req.body);
    const result = await query.exec();

    if (result.n) {
      const replacedUser = await this.model.findById(req.params.id);
      this.render(resp, next)(replacedUser);
    } else {
      throw new NotFoundError('Doument not founded');
    }
  };

  delete = async (req: Request, resp: Response, next: Next) => {
    try {
      const query = this.model.deleteOne({ _id: req.params.id });
      const result = await query.exec();

      if (result.n) {
        resp.send(204);
      } else {
        throw new NotFoundError('Documento não encontrado!');
      }
    } catch (error) {
      return next(error);
    }

    return next();
  };
}
