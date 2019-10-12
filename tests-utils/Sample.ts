export function Sample<T>(collection: T[]): T {
  return collection[Math.floor(Math.random() * collection.length)];
}
