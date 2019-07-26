import { runServer } from './server';

const port = process.env.PORT || 8000;

runServer({ url: 'http://localhost', port });
