import { INestApplication } from '@nestjs/common';
import logger from '../logger';

interface ServerConfiguration {
  app: INestApplication;
  env: string;
  port: number | string;
  mapEnvToUrl: (env: string) => string;
}

export const RunServer = async ({
  app,
  env,
  port,
  mapEnvToUrl
}: ServerConfiguration): Promise<void> => {
  const url = mapEnvToUrl(env);
  return app.listen(port, (): void => {
    logger.info(`running on: ${url}:${port}`);
    logger.info(`view API doc: ${url}:${port}/swagger`);
  });
};
