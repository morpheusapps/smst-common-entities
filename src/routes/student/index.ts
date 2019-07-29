import { CreateRouter } from '../utils/CreateRouter';
import { CreateStudent, GetAllStudents } from '../../domain/student';
import { API, Route, MethodType } from '../../types/serverTypes';

const apis: API[] = [
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
  {
    route: '/',
    method: MethodType.Get,
    action: GetAllStudents
  },
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
   *            email:
   *              type: string
   *              example: "email@gmail.com"
   *            schoolId:
   *              type: number
   *              example: 1234
   *            userId:
   *              type: number
   *              example: 1234
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   */
  {
    route: '/',
    method: MethodType.POST,
    action: CreateStudent
  }
];

const path = '/student';

const router = CreateRouter({ path, apis });

const route: Route = {
  router,
  path
};

export default route;
