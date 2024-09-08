// deno-lint-ignore-file no-explicit-any
/**
 * `IsObject<T>` checks if a given type `T` is an object that is not an array.
 * It excludes `null`, `undefined`, arrays, and `any` types by first removing `null` and `undefined` using `NonNullable`.
 *
 * It uses the `infer` keyword to correctly handle union types and ensure that each branch of a union is evaluated separately.
 *
 * @template T - The type to evaluate.
 * @returns `true` if `T` is an object but not an array, otherwise `false`.
 */
export type IsObject<T> = [T] extends [never] ? false
  : T extends any ? T extends object ? T extends any[] ? false
      : true
    : false
  : false;
