import express from 'express';
import { ApolloServer, Config } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import { rawSchema } from './graphql';

const schema = makeExecutableSchema(rawSchema);

const serverConfig: Config = {
  schema,
  context: {},
  subscriptions: {},
  playground: {
    settings: {
      'editor.theme': 'dark',
      'editor.cursorShape': 'line'
    }
  }
};
const server = new ApolloServer(serverConfig);

const app = express();

//server.applyMiddleware({ app, path: '/graphql' });

export const runServer = async (port: number | string): Promise<void> => {
  const { url } = await server.listen(port);
  // eslint-disable-next-line no-console
  console.log(url);
};
