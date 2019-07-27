import { CreateRouter } from '../utils/CreateRouter';
import { Route } from '../../types/server/Route';
import { PostStudent } from '../../domain/PostStudent';

const path = '/student';

const router = CreateRouter(path);

/**
 * @swagger
 *
 * /student:
 *   get:
 *     tags:
 *       - Student
 *     description: Get All Students
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

/**
 * @swagger
 *
 * /student:
 *   post:
 *     tags:
 *       - Student
 *     description: Create Student
 *     parameters:
 *       - name: Student
 *         in: body
 *         description: Student Credentials
 *         schema:
 *          properties:
 *            name:
 *              type: string
 *              example: maor
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', (req, res): void => {
  PostStudent(req, res);
});

const route: Route = {
  router,
  path
};

export default route;
