import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RunServer } from './utils/RunServer';
import { GetUrlByEnv } from './utils/GetUrlByEnv';
import { ApplicationModule } from './app';
import { Swagger } from './swagger';
import { urls } from './const';

export const runServer = async (port: string | number): Promise<void> => {
  const server = express();
  const app = await NestFactory.create(
    ApplicationModule,
    new ExpressAdapter(server)
  );
  Swagger(app);
  const getUrlByEnv = GetUrlByEnv(urls);
  return RunServer({
    app,
    port,
    env: process.env.NODE_ENV,
    mapEnvToUrl: getUrlByEnv
  });
};
