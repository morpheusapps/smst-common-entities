import express from 'express';
import { RunServer } from './RunServer';
import { Fakes } from '../../tests/Fakes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
jest.mock('express', () => () => ({
  listen: jest.fn((port: number): number => port)
}));

describe('RunServer', (): void => {
  let mapEnvToUrl: () => string;
  beforeEach((): void => {
    mapEnvToUrl = jest.fn((): string => Fakes.string());
  });
  test('development env', async (): Promise<void> => {
    const app = express();
    const env = Fakes.string();
    const port = Fakes.number();

    const response = await RunServer({ app, env, port, mapEnvToUrl });
    expect(response).toBe(port);
  });
});
