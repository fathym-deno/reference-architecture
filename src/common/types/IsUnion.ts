/**
 * Checks if a given type `T` is a union type.
 *
 * @template T - The type to check for union membership.
 * @template U - Internal helper (defaults to `T`). This is used to preserve the original type `T` for comparison.
 *
 * @description
 * TypeScript conditional types distribute over unions when extending from `any`, so
 * the check `T extends any` will be applied to each member of the union separately.
 * To determine whether `T` is a union, we compare `T` with the original type `U` wrapped
 * in a tuple. If `T` is not a union, `[U] extends [T]` will be `true`; if `T` is a union,
 * the check will fail for individual members of the union, and thus return `false`.
 *
 * ### Key Points:
 * - If `T` is a union, the distribution across its members will return `true`.
 * - If `T` is not a union (e.g., a single type, `never`, or an intersection), it returns `false`.
 *
 * @example
 * type Test1 = IsUnion<string | number>; // true
 * type Test2 = IsUnion<string>;          // false
 * type Test3 = IsUnion<string & number>; // false
 * type Test4 = IsUnion<never>;           // false
 *
 * @returns `true` if `T` is a union, `false` otherwise.
 */
export type IsUnion<T, U = T> = [T] extends [never] // Handle `never` type explicitly
  ? false
  : T extends U // Distribute over union members
    ? [U] extends [T] // Check if it's a non-union
      ? false
    : true
  : false;
