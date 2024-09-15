import type { UnionToIntersection } from './UnionToIntersection.ts';

export type ObjectPropertiesToIntersection<T> = UnionToIntersection<
  {
    [K in keyof T]: T[K];
  }[keyof T]
>;
