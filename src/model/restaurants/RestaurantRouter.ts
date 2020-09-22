import { Next, Request, Response, Server } from 'restify';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../../server/ModelRouter';
import { Restaurant, RestaurantModel } from './RestaurantModel';

export class RestaurantRouter extends ModelRouter<Restaurant> {
  Domain = '/api/restaurants';

  constructor() {
    super(RestaurantModel);
  }

  envelop(document: any) {
    let resource = super.envelop(document);
    resource._links.menu = `${this.basePath}/${resource._id}/menu`;
    return resource;
  }

  findMenu = async (req: Request, resp: Response, next: Next) => {
    try {
      const restaurants = await RestaurantModel.findById(req.params.id, '+menu');
      if (!restaurants) {
        throw new NotFoundError('Document not found');
      } else {
        resp.json(restaurants.menu);
        return next();
      }
    } catch (error) {
      return next(error);
    }
  };

  replaceMenu = async (req: Request, resp: Response, next: Next) => {
    try {
      const restaurant = await RestaurantModel.findById(req.params.id);
      if (!restaurant) {
        throw new NotFoundError('Restaurant not found');
      } else {
        restaurant.menu = req.body;
        const result = await restaurant.save();
        resp.json(result.menu);
        return next();
      }
    } catch (error) {
      next(error);
    }
  };

  setRoutes(server: Server): void {
    server.get(this.Domain, this.findAll);
    server.get(`${this.Domain}/:id`, this.validateId, this.findById);
    server.post(this.Domain, this.save);
    server.put(`${this.Domain}/:id`, this.validateId, this.replace);
    server.del(`${this.Domain}/:id`, this.validateId, this.delete);

    server.get(`${this.Domain}/:id/menu`, this.validateId, this.findMenu);
    server.put(`${this.Domain}/:id/menu`, this.validateId, this.replaceMenu);
  }
}
