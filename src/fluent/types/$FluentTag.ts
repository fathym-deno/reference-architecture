import type { $TagValues } from "../.deps.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";

export type $FluentTag<
    TType extends $FluentTagTypeOptions = $FluentTagTypeOptions,
    TTag extends $FluentTagOptions<TType> = $FluentTagOptions<TType>,
    TData extends $FluentTagDataKeyOptions<TType> = never,
    // deno-lint-ignore no-explicit-any
    TValues extends Record<TData, any> = never,
> = $TagValues<TType, TTag, TData, TValues>;
