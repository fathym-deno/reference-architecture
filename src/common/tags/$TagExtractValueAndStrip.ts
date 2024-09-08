import type { $TagExtractValue } from "./$TagExtractValue.ts";
import type { $TagStrip } from "./$TagStrip.ts";

/**
 * `$TagExtractValueAndStrip<T, TType, TTag, TData>` extracts the tag data value from a `$Tag` type and returns it
 * along with the stripped version of the type.
 *
 * The result includes:
 * - `Stripped`: The type `T` with all tag metadata removed.
 * - `Value`: The extracted tag data value.
 *
 * @template T - The type from which to extract the tag data value and strip metadata.
 * @template TType - The tag type (string) used to identify metadata keys.
 * @template TTag - The specific tag to match.
 * @template TData - The data key from which to extract the tag value.
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
