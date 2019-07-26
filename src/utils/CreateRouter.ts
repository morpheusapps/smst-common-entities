import express, { Router } from 'express';
import logger from '../logger';

export const createRouter = (path: string): Router => {
  const router = express.Router();

  router.use((req, res, next): void => {
    const routePath = path + req.url;

    logger.log(`${req.method} ${routePath}`);
    next();
  });

  return router;
};
