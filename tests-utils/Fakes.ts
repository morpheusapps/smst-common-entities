import faker from 'faker';

export const Fakes = {
  number: (): number => faker.random.number(),
  boolean: (): boolean => faker.random.boolean(),
  string: (): string => faker.lorem.words().replace(/\s/g, '-'),
  uuid: (): string => faker.random.uuid()
};
