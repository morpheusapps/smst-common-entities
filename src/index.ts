import { meow } from './meow';

const greeter = (person: string) => `Hello ${meow()} ${person}!`;

const name = `Node Hero`;

// eslint-disable-next-line no-console
console.log(greeter(name));
