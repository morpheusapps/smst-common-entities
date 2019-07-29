import { Request, Response } from 'express';
import { CreateRouter } from '../utils/CreateRouter';
import { API, Route, MethodType } from '../../types/serverTypes';

const apis: API[] = [
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
  {
    route: '/',
    method: MethodType.Get,
    action: (req: Request, res: Response): void => {
      res.sendStatus(200);
    }
  }
];

const path = '/health';

const router = CreateRouter({ path, apis });

const route: Route = {
  router,
  path
};

export default route;
