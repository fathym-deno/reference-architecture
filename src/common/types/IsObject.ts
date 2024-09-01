// deno-lint-ignore-file no-explicit-any

/**
 * Provides a type to check if a given type is an object that is not an array.
 */
export type IsObject<T> = NonNullable<T> extends object
  ? NonNullable<T> extends any[] ? false
  : true
  : false;
