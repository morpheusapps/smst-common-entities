import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { INestApplication } from '@nestjs/common';

const ApiLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info(`request ${req.method} ${req.url}`);
  res.on('finish', (): void => {
    logger.info(`response ${req.method} ${res.statusCode} ${req.url}`);
  });
  next();
};

export const ApiLogger = (app: INestApplication): INestApplication =>
  app.use(ApiLoggerMiddleware);
