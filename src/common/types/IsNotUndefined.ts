/**
 * Used to determine if a type is not undefined or optionally undefined.
 */

export type IsNotUndefined<T> = [T] extends [undefined] ? true
  : [undefined] extends [T] ? true
  : T extends undefined ? true
  : undefined extends T ? true
  : false;
