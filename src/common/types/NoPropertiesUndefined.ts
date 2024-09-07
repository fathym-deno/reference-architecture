import type { IsNativeType } from "./IsNativeType.ts";

/**
 * `NoPropertiesUndefined<T>` is a TypeScript utility type that recursively removes `undefined` and `null`
 * from all properties and sub-properties of an object type `T`.
 *
 * This utility is designed to ensure that all properties are strictly defined and non-nullable. It also
 * handles more complex scenarios such as arrays, tuples, and native types like `Promise`, `Date`, `Map`, and `Set`.
 *
 * @template T - The source object type that will be transformed by removing `undefined` and `null`.
 *
 * @remarks
 * - For objects, it recursively traverses all properties and ensures that none are `undefined` or `null`.
 * - For arrays and tuples, it removes `undefined` and `null` from the inner types while maintaining the structure.
 * - For native types (e.g., `Promise`, `Date`, `Map`, `Set`), it ensures that their generic parameters
 *   (if any) are also processed to remove `undefined` and `null`.
 * - Functions are skipped from processing since their structure doesn't involve `undefined` or `null`.
 *
 * @example
 * // Basic Usage
 * type Original = { a: string | undefined; b: number | null };
 * type Result = NoPropertiesUndefined<Original>;
 * // Resulting Type: { a: string; b: number }
 *
 * @example
 * // Handling Tuples
 * type Original = [string | undefined, number | null];
 * type Result = NoPropertiesUndefined<Original>;
 * // Resulting Type: [string, number]
 *
 * @example
 * // Handling Promises
 * type Original = { a: Promise<string | undefined> | undefined };
 * type Result = NoPropertiesUndefined<Original>;
 * // Resulting Type: { a: Promise<string> }
 *
 * @example
 * // Handling Nested Objects and Arrays
 * type Original = { a: { b: string | undefined; c: null }[] };
 * type Result = NoPropertiesUndefined<Original>;
 * // Resulting Type: { a: { b: string; c: never }[] }
 *
 * @note
 * This utility skips native types like `Date`, `Map`, and `Set` to avoid over-processing them. It also
 * strips undefined/null from generic parameters in types like `Promise<T>`.
 */
export type NoPropertiesUndefined<T> =
  // Handle tuples (fixed-length arrays)
  T extends [infer A, ...infer B] ? B extends [] ? [NoPropertiesUndefined<A>]
    : [NoPropertiesUndefined<A>, ...NoPropertiesUndefined<B>]
    : T extends (infer U)[]
    // Handle arrays
      ? NoPropertiesUndefined<U>[]
    // deno-lint-ignore no-explicit-any
    : T extends (...args: any[]) => any
    // Skip functions
      ? T
    : T extends Promise<infer U>
    // Handle Promises by unwrapping the inner type and applying NoPropertiesUndefined
      ? Promise<NoPropertiesUndefined<U>>
    : IsNativeType<T> extends true
    // If it's a native type, skip processing
      ? T
    : T extends object
    // Process objects recursively
      ? { [K in keyof T]-?: NoPropertiesUndefined<NonNullable<T[K]>> }
    : NonNullable<T>;
