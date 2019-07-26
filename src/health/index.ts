import { createRouter } from '../utils/CreateRouter';
import { Route } from '../types/server/Route';

const path = '/health';

const router = createRouter(path);

router.get('/', (req, res): void => {
  res.sendStatus(200);
});

const route: Route = {
  router,
  path
};

export default route;
