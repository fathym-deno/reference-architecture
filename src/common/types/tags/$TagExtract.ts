import type { $TagExists } from "./$TagExists.ts";

/**
 * Extracts the tag from a $Tag type.
 */
export type $TagExtract<T, TType extends string> = false extends $TagExists<
  T,
  TType
> ? never
  : NonNullable<T> extends { [Key in `@${TType}`]?: infer TValue }
    ? NonNullable<TValue>
  : never;
