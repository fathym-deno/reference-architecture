/**
 * Used to determine if a type is, or optionally, is undefined.
 */
export type IsUndefined<T> = [T] extends [undefined] ? true
  : [undefined] extends [T] ? true
  : T extends undefined ? true
  : undefined extends T ? true
  : false;
