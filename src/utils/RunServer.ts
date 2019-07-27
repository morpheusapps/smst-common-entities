import { Express } from 'express';
import { Server } from 'http';
import logger from '../logger';

interface ServerConfiguration {
  app: Express;
  env: string;
  port: number | string;
  mapEnvToUrl: (env: string) => string;
}

export const RunServer = async ({
  app,
  env,
  port,
  mapEnvToUrl
}: ServerConfiguration): Promise<Server> => {
  const url = mapEnvToUrl(env);
  return app.listen(port, (): void => {
    logger.info(`running on: ${url}:${port}`);
    logger.info(`view API doc: ${url}:${port}/swagger`);
  });
};
