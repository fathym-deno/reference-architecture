/**
 * `ExtractKeysByPrefix<T, Prefix>` is a TypeScript utility type that extracts properties
 * from an object type `T` whose keys start with the given `Prefix`.
 *
 * This is useful when you want to create a type containing only those properties
 * from `T` that match a specific prefix pattern.
 *
 * @template T - The source object type from which properties will be extracted.
 * @template Prefix - A string literal that defines the prefix for extracting keys.
 * Defaults to `"$"` if not provided.
 *
 * @example
 * type Original = { $internal: string; external: number; config: boolean };
 * type Extracted = ExtractKeysByPrefix<Original>;
 * // Result: { $internal: string }
 */
export type ExtractKeysByPrefix<
  T,
  Prefix extends string = "$",
> = T extends infer U ? {
    [
      K in keyof U as K extends `${Prefix}${infer S}` ? K extends keyof U ? K
        : never
        : never
    ]: U[K];
  }
  : T;
