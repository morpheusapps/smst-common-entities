import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { INestApplication } from '@nestjs/common';

const ApiLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info(`handling request ${req.method} ${req.url} ...`);
  const onRequestTime = Date.now();
  res.on('finish', (): void => {
    const onResponseTime = Date.now();
    const responseTime = onResponseTime - onRequestTime;
    logger.info(
      `response ${req.method} ${req.url} ${res.statusCode} took ${responseTime}ms`
    );
  });
  next();
};

export const ApiLogger = (app: INestApplication): INestApplication =>
  app.use(ApiLoggerMiddleware);
