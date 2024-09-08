import type { $TagExtractValue } from "./$TagExtractValue.ts";
import type { $TagStrip } from "./$TagStrip.ts";

/**
 * Extracts the tag data value from a $Tag type and returns it along with the stripped type.
 */
export type $TagExtractValueAndStrip<
  T,
  TType extends string,
  TTag,
  TData extends string,
> = {
  Stripped: $TagStrip<T, TType, TTag>;

  Value: $TagExtractValue<T, TType, TData>;
};
