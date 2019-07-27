import { runServer } from './server';

const port = process.env.PORT || 8000;

runServer({ env: process.env.NODE_ENV, port });
