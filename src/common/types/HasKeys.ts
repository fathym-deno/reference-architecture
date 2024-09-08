import type { ExtractKeysByPrefix } from "./ExtractKeysByPrefix.ts";
import type { IsObject } from "./IsObject.ts";

/**
 * `HasKeys<T, Prefix>` checks if the object `T` has any keys that start with the given `Prefix`.
 *
 * It returns `false` if `T` is not an object, or if no keys in `T` start with `Prefix`.
 * It returns `true` if any keys in `T` match the `Prefix`.
 *
 * @template T - The object type to check for keys.
 * @template Prefix - The string prefix to search for in the object keys.
 */
export type HasKeys<
  T,
  Prefix extends string = "",
> = false extends IsObject<T> ? false
  : keyof ExtractKeysByPrefix<T, Prefix> extends [never] ? false
  : true;
