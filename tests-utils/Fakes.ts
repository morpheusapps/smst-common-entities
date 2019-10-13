import faker from 'faker';
import { Sample } from './Sample';

interface OptionalArgs {
  withNull?: boolean;
}

export const Fakes = {
  number: (): number => faker.random.number(),
  boolean: (): boolean => faker.random.boolean(),
  string: (): string => faker.lorem.words(),
  numberOptional: (args?: OptionalArgs): number | undefined | null =>
    Sample(
      args && args.withNull
        ? [faker.random.number(), undefined, null]
        : [faker.random.number(), undefined]
    ),
  booleanOptional: (args?: OptionalArgs): boolean | undefined | null =>
    Sample(
      args && args.withNull
        ? [faker.random.boolean(), undefined, null]
        : [faker.random.boolean(), undefined]
    ),
  stringOptional: (args?: OptionalArgs): string | undefined | null =>
    Sample(
      args && args.withNull
        ? [faker.lorem.words(), undefined, null]
        : [faker.lorem.words(), undefined]
    ),
  uuid: (): string => faker.random.uuid(),
  route: (): string => `/${faker.internet.domainWord()}`
};
