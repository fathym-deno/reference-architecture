// deno-lint-ignore-file no-explicit-any

/**
 * Used to extract the value type of a record type. If the input type is not a record, the type will be `never`.
 */
export type ValueType<T> = T extends Record<any, infer V> ? V
  : never;
