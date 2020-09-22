import { Next, plugins, Request, Response, Server } from 'restify';
import { ModelRouter } from '../../server/ModelRouter';
import UserModel, { IUser, IUserSchema } from './UserModel';

export class UserRouter extends ModelRouter<IUserSchema> {
  constructor() {
    super(UserModel);
    this.on('beforeRender', (document: IUser | IUser[]) => {
      if (document instanceof Array) {
        document.forEach((doc) => (doc.password = ''));
      } else {
        document.password = '';
      }
    });
  }

  findByEmail = async (req: Request, resp: Response, next: Next) => {
    try {
      if (req.query.email) {
        const result = await this.model.find({ email: req.query.email });
        this.render(resp, next)([result]);
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  };

  setRoutes(server: Server): void {
    server.get(
      this.basePath,
      plugins.conditionalHandler([
        { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
        { version: '1.0.0', handler: this.findAll },
      ]),
    );

    server.get(`${this.basePath}/:id`, this.validateId, this.findById);

    server.post(this.basePath, this.save);

    server.put(`${this.basePath}/:id`, this.validateId, this.replace);

    server.del(`${this.basePath}/:id`, this.validateId, this.delete);
  }
}
