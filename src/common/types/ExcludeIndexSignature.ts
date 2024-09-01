/**
 * used to remove an index signature from a type.
 */
export type ExcludeIndexSignature<T> = {
  [K in keyof T as K extends string ? K : never]: T[K];
};
