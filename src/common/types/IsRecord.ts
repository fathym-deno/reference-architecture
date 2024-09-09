import type { HasIndexSignatures } from "./HasIndexSignatures.ts";
import type { IsNativeType } from "./IsNativeType.ts";
import type { IsObject } from "./IsObject.ts";

/**
 * `IsRecord<T>` checks if a given type `T` is a record-like object.
 * It evaluates to `true` if:
 * - `T` is an object type (not a primitive type or native type).
 * - `T` is not a native type like `Date`, `Array`, etc.
 * - `T` has index signatures.
 *
 * Otherwise, it evaluates to `false`.
 *
 * ### Example Usage:
 *
 * #### Primitives:
 * ```ts
 * type Result = IsRecord<string>; // false
 * ```
 *
 * #### Native Types:
 * ```ts
 * type Result = IsRecord<Date>; // false
 * ```
 *
 * #### Record Types:
 * ```ts
 * type Result = IsRecord<Record<string, any>>; // true
 * ```
 *
 * #### Complex Objects:
 * ```ts
 * type Example = {
 *   name: string;
 *   [key: string]: any;
 * };
 * type Result = IsRecord<Example>; // true
 * ```
 *
 * #### Objects Without Index Signatures:
 * ```ts
 * type SimpleObject = { name: string };
 * type Result = IsRecord<SimpleObject>; // false
 * ```
 */
export type IsRecord<T> = T extends infer U ? false extends IsObject<U> ? false
  : true extends IsNativeType<U> ? false
  : false extends HasIndexSignatures<U> ? false
  : true
  : T;
