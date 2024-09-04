/**
 * Used to exclued properties that match the given key.
 */

export type ExcludeKeys<T, TKey extends string, Prefix extends string = ""> = {
    [K in keyof T as K extends `${Prefix}${TKey}` ? never : K]: T[K];
};
