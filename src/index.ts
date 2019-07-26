import { meow } from './meow';

const greeter = (person: string) => `Hello ${meow()} ${person}!`;

const name = 'Node Hero';

console.log(greeter(name));
