import { DocumentQuery } from 'mongoose';
import { Server } from 'restify';
import { ModelRouter } from '../../server/ModelRouter';
import { reviewModel, ReviewSchema } from './ReviewModel';

export class ReviewRouter extends ModelRouter<ReviewSchema> {
  Domain = '/api/reviews';

  constructor() {
    super(reviewModel);
  }

  protected prepareOne(query: DocumentQuery<ReviewSchema, ReviewSchema>): DocumentQuery<ReviewSchema, ReviewSchema> {
    return query.populate('user', 'name').populate('restaurant', 'name');
  }

  envelop(document: any) {
    let resource = super.envelop(document);
    const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
    resource._link.restaurant = `/restaurants/${restaurantId}`;

    return resource;
  }

  // findById = async (req: Request, resp: Response, next: Next) => {
  //   console.log('aqui');
  //   const review = await reviewModel.findById(req.params.id).populate('user', 'name').populate('restaurant');
  //   this.render(resp, next)(review);
  // };

  setRoutes(server: Server): void {
    server.get(this.Domain, this.findAll);
    server.get(`${this.Domain}/:id`, this.validateId, this.findById);
    server.post(this.Domain, this.save);
  }
}
