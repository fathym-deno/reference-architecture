/**
 * Used to resolve any index signatures from a type.
 */
export type ResolveIndexSignatures<T> = {
  [K in keyof T as K extends `${infer _}` ? never : K]: T[K];
};
