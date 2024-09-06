import type { $TagExists } from "./$TagExists.ts";

/**
 * Extracts all the tag data values from a $Tag type in a nested structure.
 */
export type $TagExtractValues<
  T,
  TType extends string,
  TTag,
  TData extends string,
> = false extends $TagExists<T, TType, TTag> ? never
  : {
    [KType in TType]: {
      [KData in TData]: NonNullable<T> extends {
        [Key in `@${KType}-${KData}`]?: infer TValue;
      } ? NonNullable<TValue>
        : never;
    };
  };
