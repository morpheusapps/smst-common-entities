import { GetUrlByEnv } from './GetUrlByEnv';
import { Env, Urls } from '../types';
import { FakeUrls } from '../types/index.fake';
import { Fakes } from '../../tests/Fakes';

describe('GetUrlByEnv', (): void => {
  let getUrlsByEnv: (env: string) => string;
  let fakeUrls: Urls;
  beforeEach((): void => {
    fakeUrls = FakeUrls();
    getUrlsByEnv = GetUrlByEnv(fakeUrls);
  });
  test('development env', (): void => {
    const env = Env.Development;

    const url = getUrlsByEnv(env);

    expect(url).toBe(fakeUrls.local);
  });

  test('test env', (): void => {
    const env = Env.Test;

    const url = getUrlsByEnv(env);

    expect(url).toBe(fakeUrls.local);
  });

  test('production env', (): void => {
    const env = Env.Production;

    const url = getUrlsByEnv(env);

    expect(url).toBe(fakeUrls.production);
  });

  test('custom env', (): void => {
    const env = Fakes.string();

    const url = getUrlsByEnv(env);

    expect(url).toBe(fakeUrls.local);
  });
});
