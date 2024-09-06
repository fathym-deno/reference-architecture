/**
 * used to remove an index signature from a type.
 */
export type RemoveIndexSignatures<T> = {
  [
    K in keyof T as string extends K ? never
      : number extends K ? never
      : symbol extends K ? never
      : K
  ]: T[K];
};
