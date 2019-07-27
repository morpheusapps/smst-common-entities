import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import logger from './logger';
import { routes } from './routes';

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

interface ServerConfiguration {
  env: string;
  port: number | string;
}

export const runServer = async ({
  env,
  port
}: ServerConfiguration): Promise<void> => {
  let url = '';
  switch (env) {
    case 'development':
    case 'test': {
      url = 'http://localhost';
      break;
    }
    case 'production': {
      url = 'http://localhost';
      break;
    }
    default:
      url = 'http://localhost';
  }
  app.listen(port, (): void => {
    // eslint-disable-next-line no-console
    logger.info(`running on: ${url}:${port}`);
  });
};
