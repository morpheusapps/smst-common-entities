import { createRouter } from '../../utils/CreateRouter';
import { Route } from '../../types/server/Route';

const path = '/health';

const router = createRouter(path);

/**
 * @swagger
 *
 * /health:
 *   get:
 *     tags:
 *       - General
 *     description: Health Check
 *     parameters: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', (req, res): void => {
  res.sendStatus(200);
});

const route: Route = {
  router,
  path
};

export default route;
