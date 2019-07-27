import express, { Router } from 'express';
import { Route } from '../../types/server/Route';

export const combineRoutes = (routes: Route[]): Router => {
  const mainRouter = express.Router();

  const appRoutes = routes;
  appRoutes.forEach(({ path, router }): Router => mainRouter.use(path, router));

  return mainRouter;
};
