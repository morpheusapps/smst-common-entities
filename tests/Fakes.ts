import faker from 'faker';

export const Fakes = {
  number: (): number => faker.random.number(),
  uuid: (): string => faker.random.uuid(),
  boolean: (): boolean => faker.random.boolean(),
  string: (): string => faker.lorem.words().replace(/\s/g, '-')
};
