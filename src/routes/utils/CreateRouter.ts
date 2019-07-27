import express, { Router } from 'express';
import logger from '../../logger';

export const CreateRouter = (path: string): Router => {
  const router = express.Router();

  router.use((req, res, next): void => {
    const routePath = path + req.url;

    logger.info(`request ${req.method} ${routePath}`);
    res.on('finish', (): void => {
      logger.info(`response ${req.method} ${res.statusCode} ${routePath}`);
    });
    next();
  });

  return router;
};
