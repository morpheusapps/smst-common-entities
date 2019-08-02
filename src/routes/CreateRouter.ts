import express, { Router, Request, Response } from 'express';
import { MethodType, Middleware } from '../types/serverTypes';
import logger from '../logger';

interface API {
  route: string;
  method: MethodType;
  action: (req: Request, res: Response) => void | Promise<void>;
}

const logApiMiddleware = (path: string): Middleware => (
  req,
  res,
  next
): void => {
  const routePath = path + req.url;

  logger.info(`request ${req.method} ${routePath}`);
  res.on('finish', (): void => {
    logger.info(`response ${req.method} ${res.statusCode} ${routePath}`);
  });
  next();
};

export const CreateRouter = ({
  path,
  apis,
  middlewares = []
}: {
  path: string;
  apis: API[];
  middlewares?: Middleware[];
}): Router => {
  const router = express.Router();

  router.use(logApiMiddleware(path));
  middlewares.forEach(
    (middleware: Middleware): Router => router.use(middleware)
  );

  apis.forEach(
    ({ route, method, action }: API): Router => router[method](route, action)
  );

  return router;
};
