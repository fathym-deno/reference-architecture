/**
 * `$TagExtractValues<T, TType, TData>` extracts all tag data values from a `$Tag` type `T`
 * in a nested structure, based on tag type `TType` and tag data `TData`.
 *
 * It dynamically infers the value `TValue` for each tag and returns `NonNullable<TValue>`.
 *
 * @template T - The type from which to extract the tag data values.
 * @template TType - The tag type (string) to extract the values from.
 * @template TData - The tag data (string) to extract the values from.
 */
export type $TagExtractValues<T, TType extends string, TData extends string> = {
  [KType in TType]: {
    [KData in TData]: NonNullable<T> extends {
      [Key in `@${KType}-${KData}`]?: infer TValue;
    } ? NonNullable<TValue>
      : never;
  };
};
