import type { $TagExists } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagExists<T, TType, TTag, TData>` checks if a `$FluentTag` exists within a type `T`.
 *
 * You can check at varying levels of specificity:
 * 1. **High-level tag type check (`TType`)**:
 *    - Checks if any `$FluentTag` of type `TType` exists.
 * 2. **Specific tag value check (`TTag`)**:
 *    - Checks if the tag value matches the provided `TTag`.
 * 3. **Tag data check (`TData`)**:
 *    - Checks for the presence of specific metadata values within the tag.
 *
 * @template T - The type being checked for the presence of a Fluent tag.
 * @template TType - The tag type (e.g., "Methods"), used to identify tags.
 * @template TTag - The specific tag value to match (optional, defaults to unknown).
 * @template TData - The specific metadata value to match (optional, defaults to never).
 *
 * @example
 * // Checking for the existence of a Fluent tag with type "Methods".
 * type Example1 = $FluentTagExists<{ '@Methods': 'Object' }, 'Methods'>; // true
 *
 * @example
 * // Checking for a specific tag and value.
 * type Example2 = $FluentTagExists<{ '@Methods': 'Record' }, 'Methods', 'Record'>; // true
 *
 * @example
 * // Checking for a specific tag with additional metadata.
 * type Example3 = $FluentTagExists<{ '@Methods-handlers': { save: () => void } }, 'Methods', 'Record', 'handlers'>; // true
 */
export type $FluentTagExists<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> | unknown = unknown,
  TData extends $FluentTagDataKeyOptions<TType> = never,
> = $TagExists<T, TType, TTag, TData>;
