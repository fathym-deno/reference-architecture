/**
 * Used to exclued properties that start with the given prefix.
 */
export type ExcludeKeysByPrefix<T, Prefix extends string = "$"> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K];
};
