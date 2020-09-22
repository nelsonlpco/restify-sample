import { RestaurantRouter } from './model/restaurants/RestaurantRouter';
import { ReviewRouter } from './model/reviews/ReviewRouter';
import { UserRouter } from './model/users/UserRouter';
import { ApplicationServer } from './server';

(async () => {
  const routes = [new UserRouter(), new RestaurantRouter(), new ReviewRouter()];

  new ApplicationServer().bootstrap(routes);
})();
