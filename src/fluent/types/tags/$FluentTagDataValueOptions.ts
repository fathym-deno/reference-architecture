// deno-lint-ignore-file no-explicit-any
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagMethodsDataValueOptions` provides specific value types for each key in the `"Methods"` tag type.
 *
 * These value types define the structure of metadata that can be associated with each key.
 *
 * ### Key Value Types:
 * - `"generic"`: Boolean value (`true`).
 * - `"handlers"`: Object containing handler functions (`{ [lookup: string]: (...args: any[]) => any; }`).
 */
type $FluentTagMethodsDataValueOptions = {
  generic: true;

  handlers: {
    [lookup: string]: (...args: any[]) => any;
  };
};

/**
 * `$SelectFluentTagMethodsDataValue<TType, TData>` selects the correct value type for a given tag type and key.
 *
 * This utility type ensures that the right value type is chosen based on the tag type and the key.
 *
 * ### Parameters:
 * - `TType`: The base tag type (e.g., `"Methods"`).
 * - `TData`: The data key for which to retrieve the value type.
 *
 * ### Example:
 * ```typescript
 * type HandlersValue = $SelectFluentTagMethodsDataValue<"Methods", "handlers">;
 * // HandlersValue: { [lookup: string]: (...args: any[]) => any; }
 * ```
 */
type $SelectFluentTagMethodsDataValue<
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $FluentTagMethodsDataValueOptions[TData];

/**
 * `$FluentTagDataValueTypesOptions<TType, TData>` maps the provided tag type and data key to its corresponding value type.
 *
 * This type enables different Fluent tag types and keys to have their own sets of valid value types.
 * For example, for the `"Methods"` tag type:
 * - `"generic"` resolves to `true`.
 * - `"handlers"` resolves to an object of functions.
 *
 * ### Parameters:
 * - `TType`: The base tag type (e.g., `"Methods"`).
 * - `TData`: The data key (e.g., `"generic"` or `"handlers"`) for which to retrieve the value type.
 *
 * ### Example:
 * ```typescript
 * type GenericValue = $FluentTagDataValueTypesOptions<"Methods", "generic">;
 * // GenericValue: true
 *
 * type HandlersValue = $FluentTagDataValueTypesOptions<"Methods", "handlers">;
 * // HandlersValue: { [lookup: string]: (...args: any[]) => any; }
 * ```
 *
 * ### Behavior:
 * - For `"Methods"` tag type:
 *   - `"generic"` resolves to `true`.
 *   - `"handlers"` resolves to an object of handler functions.
 * - For unrecognized tag types or keys: Returns `never`.
 */
export type $FluentTagDataValueTypesOptions<
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = TType extends "Methods" ? $SelectFluentTagMethodsDataValue<TType, TData>
  : never;
