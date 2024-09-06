// deno-lint-ignore-file no-explicit-any
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * The Fluent tag data key options.
 */
type $FluentTagMethodsDataValueOptions = {
  generic: true;

  handlers: {
    [lookup: string]: (...args: any[]) => any;
  };
};

type $SelectFluentTagMethodsDataValue<
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $FluentTagMethodsDataValueOptions[TData];

/**
 * Map for looking up the Fluent tag data value type options for a tag
 */
export type $FluentTagDataValueTypesOptions<
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = TType extends "Methods" ? $SelectFluentTagMethodsDataValue<TType, TData>
  : never;

type x = $FluentTagDataValueTypesOptions<"Methods", "generic">;
