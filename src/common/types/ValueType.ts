// deno-lint-ignore-file no-explicit-any
/**
 * `ValueType<T>` extracts the value type of a `Record` type. If the input type `T` is not a record,
 * the type will resolve to `never`.
 *
 * ### Features:
 * - Works with `Record<string, T>` types to extract the value type.
 * - Handles unions and intersections of records, extracting value types appropriately.
 * - Returns `never` for non-record types.
 *
 * @template T - The type from which to extract the value.
 *
 * ### Example: Simple Record
 * ```typescript
 * type SimpleRecord = Record<string, number>;
 * type Value = ValueType<SimpleRecord>; // Value is `number`
 * ```
 *
 * ### Example: Union of Records
 * ```typescript
 * type MixedRecord = Record<string, number> | Record<string, string>;
 * type Value = ValueType<MixedRecord>; // Value is `number | string`
 * ```
 *
 * ### Example: Non-Record Type
 * ```typescript
 * type NonRecord = { a: string, b: number };
 * type Value = ValueType<NonRecord>; // Value is `never`
 * ```
 */
export type ValueType<T> = T extends Record<any, infer V> ? V : never;
