/**
 * `ExcludeKeysByPrefix<T, Prefix>` is a TypeScript utility type that constructs a new type by excluding
 * properties from the original type `T` whose key names start with the given `Prefix`.
 *
 * This is useful when you want to filter out properties that match a specific naming pattern, such as
 * excluding keys that are reserved or follow a specific convention (e.g., properties prefixed with "$").
 *
 * @template T - The source object type from which properties will be excluded.
 * @template Prefix - A string literal that defines the prefix to be excluded from the type's keys.
 * Defaults to `"$"` if not provided.
 *
 * @example
 * // Basic Example
 * type Original = { $internal: string; external: number; config: boolean };
 * type Excluded = ExcludeKeysByPrefix<Original>;
 * // Resulting Type: { external: number; config: boolean }
 *
 * @example
 * // Custom Prefix
 * type Original = { __meta: string; data: number; user: boolean };
 * type Excluded = ExcludeKeysByPrefix<Original, "__">;
 * // Resulting Type: { data: number; user: boolean }
 *
 * @note
 * - Properties whose keys do not match the given prefix are retained in the resulting type.
 * - Works with both the default `"$"` prefix and custom prefixes.
 */
export type ExcludeKeysByPrefix<T, Prefix extends string = "$"> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K];
};
