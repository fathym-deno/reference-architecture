/**
 * `ExtractExact<T, TExtract>` is a TypeScript utility type that constructs a new type by
 * extracting from `TExtract` those types that exactly match `T` from the union.
 *
 * This is useful when you want to extract exact string literals or specific types
 * from a union of string literals or other primitive types.
 *
 * @template T - The target type to match exactly.
 * @template TExtract - The union of types from which an exact match will be extracted.
 *
 * @example
 * // Extract exact string literal
 * export type $FluentTagMethodsOptions = "Record" | "Object" | "Property";
 * type Extracted = ExtractExact<$FluentTagMethodsOptions, "Object">;
 * // Resulting Type: "Object"
 *
 * @example
 * // Exact match with string union
 * type Extracted = ExtractExact<"foo" | "bar", "foo">;
 * // Resulting Type: "foo"
 *
 * @note This utility ensures that only the exact match is extracted from a union.
 * Non-matching or loosely matching types are excluded.
 */
export type ExtractExact<T, TExtract extends T> = TExtract extends T
  ? Extract<TExtract, T>
  : never;
