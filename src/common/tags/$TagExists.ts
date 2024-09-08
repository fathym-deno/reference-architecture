import type { $Tag } from "./$Tag.ts";
import type {
  ExtractKeysByPrefix,
  HasKeys,
  HasTypeCheck,
  NoPropertiesUndefined,
} from "./.deps.ts";

/**
 * `$TagExists<T, TType, TTag, TData>` checks whether a specific `$Tag` exists within a type `T`.
 * The check can be based on the tag type `TType`, the tag value `TTag`, or specific tag data `TData`.
 *
 * @template T - The type to be checked for the presence of a tag.
 * @template TType - The high-level tag type (e.g., the `@` tag type prefix).
 * @template TTag - An optional parameter to check for a specific tag value associated with `TType`.
 * @template TData - An optional parameter to check for the existence of data associated with the tag (defaults to `never`).
 *
 * The `$TagExists` utility works as follows:
 *
 * 1. **High-level tag type check (`TType`)**:
 *    - If only the `TType` is provided, the utility checks if the `$Tag` of that type exists within `T`.
 * 2. **Specific tag value check (`TTag`)**:
 *    - If `TTag` is provided, it will ensure that the tag value matches the provided `TTag`.
 * 3. **Specific tag data check (`TData`)**:
 *    - If `TData` is provided, it checks for the presence of a specific piece of data (e.g., `@TType-TData`) within the tag.
 *
 * @example
 * // Basic example checking for the existence of a tag with a type.
 * type Example1 = $TagExists<{ '@tag': string }, 'tag'>; // true
 *
 * @example
 * // Example with tag and tag value
 * type Example2 = $TagExists<{ '@tag': 'value' }, 'tag', 'value'>; // true
 *
 * @example
 * // Example with tag type, value, and specific data
 * type Example3 = $TagExists<{ '@tag-data': string }, 'tag', 'value', 'data'>; // true
 *
 * @remarks
 * - Utilizes `$Tag` to represent the tag structure.
 * - Leverages `ExtractKeysByPrefix` to extract keys prefixed with the `@` symbol.
 * - Uses `HasTypeCheck` to check type compatibility between the extracted tag and the provided criteria.
 * - Ensures that the tag's properties are fully defined using `NoPropertiesUndefined`.
 *
 * @note The utility returns `true` if the tag matches the specified criteria or `false` otherwise.
 *
 * @template tagCheck - A helper type that forms the structure for matching the tag type, value, and data.
 */
export type $TagExists<
  T,
  TType extends string,
  TTag = unknown,
  TData extends string = never,
> = false extends HasKeys<tagCheck<TType, TTag, TData>> ? false
  : true extends HasTypeCheck<
    NoPropertiesUndefined<ExtractKeysByPrefix<T, "@">>,
    tagCheck<TType, TTag, TData>
  > ? true
  : false;

type tagCheck<
  TType extends string,
  TTag,
  TData extends string,
> = NoPropertiesUndefined<
  & $Tag<TType, TTag>
  & {
    [K in `@${TType}-${TData}`]: unknown;
  }
>;
