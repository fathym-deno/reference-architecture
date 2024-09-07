// deno-lint-ignore-file no-explicit-any
/**
 * `IsNativeType<T>` checks if a given type `T` is a native JavaScript type.
 * Native types include `Date`, `Promise`, `Map`, `Set`, and others.
 *
 * This utility ensures that even generic versions of these types (e.g., `Promise<string>`)
 * are recognized as native types by matching them against their base forms (e.g., `Promise<any>`).
 *
 * @template T - The type to check.
 *
 * @example
 * // True for native types:
 * type Example1 = IsNativeType<Date>; // true
 * type Example2 = IsNativeType<Promise<string>>; // true
 *
 * @example
 * // False for non-native types:
 * type Example3 = IsNativeType<{ name: string }>; // false
 * type Example4 = IsNativeType<string>; // false
 *
 * @example
 * // Works with complex types like Records containing native types:
 * type Example5 = IsNativeType<Record<string, Date>>; // false (Record is not native)
 * type Example6 = IsNativeType<Record<string, Map<any, any>>>; // false
 */
export type IsNativeType<T> = T extends Date ? true
  : T extends Promise<any> ? true
  : T extends Map<any, any> ? true
  : T extends Set<any> ? true
  : T extends WeakMap<any, any> ? true
  : T extends WeakSet<any> ? true
  : T extends Array<any> ? false // Arrays are not considered native types themselves
  : T extends ReadonlyArray<any> ? false // Tuples and read-only arrays are also not native types
  // deno-lint-ignore ban-types
  : T extends Function ? true
  : T extends RegExp ? true
  : T extends Error ? true
  : T extends symbol ? true
  : T extends bigint ? true
  : T extends ArrayBuffer ? true
  : T extends SharedArrayBuffer ? true
  : T extends DataView ? true
  : T extends
    | Uint8Array
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array ? true
  : T extends WeakRef<any> ? true
  : T extends FinalizationRegistry<any> ? true
  : T extends ReadableStream<any> ? true
  : T extends WritableStream<any> ? true
  : T extends TransformStream<any, any> ? true
  : T extends URL ? true
  : T extends URLSearchParams ? true
  : T extends URLPattern ? true
  : T extends Blob ? true
  : T extends Request ? true
  : T extends Response ? true
  : T extends Headers ? true
  : false;
