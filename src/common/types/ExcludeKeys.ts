/**
 * Used to exclued properties that match the given key.
 */

export type ExcludeKeys<T, TKey extends string> = {
  [K in keyof T as K extends TKey ? never : K]: T[K];
};
