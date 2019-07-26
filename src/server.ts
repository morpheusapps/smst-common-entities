import express from 'express';
import bodyParser from 'body-parser';
import { routes } from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);

interface ServerConfiguration {
  url: string;
  port: number | string;
}

export const runServer = async ({
  url,
  port
}: ServerConfiguration): Promise<void> => {
  app.listen(port, (): void =>
    // eslint-disable-next-line no-console
    console.log(`running on: ${url}:${port}`)
  );
};
