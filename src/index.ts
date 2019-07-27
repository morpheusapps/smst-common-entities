import { runServer } from './server';
import { connectDb } from './db';
import logger from './logger';

const port = process.env.PORT || 8000;

const startServer = async (): Promise<void> => {
  try {
    await connectDb();
    runServer(port);
  } catch (error) {
    logger.error(error);
  }
};

startServer();
