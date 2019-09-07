import { Env, Urls } from '../types';

export const GetUrlByEnv = function(urls: Urls): (env: string) => string {
  return (env: string): string => {
    switch (env) {
      case Env.Development:
      case Env.Test: {
        return urls.local;
      }
      case Env.Production: {
        return urls.production;
      }
      default:
        return urls.local;
    }
  };
};
