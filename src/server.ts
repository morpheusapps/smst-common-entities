import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { routes } from './routes';
import { RunServer } from './utils/RunServer';
import { GetUrlByEnv } from './utils/GetUrlByEnv';
import { urls } from './const';
import { Server } from 'http';

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

export const runServer = (port: string | number): Promise<Server> => {
  const getUrlByEnv = GetUrlByEnv(urls);
  return RunServer({
    app,
    port,
    env: process.env.NODE_ENV,
    mapEnvToUrl: getUrlByEnv
  });
};
