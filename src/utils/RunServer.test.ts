import express from 'express';
import { NestFactory } from '@nestjs/core';
import { RunServer } from './RunServer';
import { Fakes } from '../../tests/Fakes';

jest.mock('@nestjs/core', (): {} => ({
  NestFactory: {
    create: jest.fn((): { listen: Function } => ({
      listen: jest.fn((port: number): number => port)
    }))
  }
}));

describe('RunServer', (): void => {
  let mapEnvToUrl: () => string;
  beforeEach((): void => {
    mapEnvToUrl = jest.fn((): string => Fakes.string());
  });
  test('development env', async (): Promise<void> => {
    const app = await NestFactory.create(express());
    const env = Fakes.string();
    const port = Fakes.number();

    const response = await RunServer({ app, env, port, mapEnvToUrl });
    expect(response).toBe(port);
  });
});
