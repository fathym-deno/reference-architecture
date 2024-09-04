import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

export type $FluentTagMethodsDataKeyOptions = "...";

export type $FluentTagDataKeyOptions<TTagType extends $FluentTagTypeOptions> =
    TTagType extends "Methods" ? $FluentTagMethodsDataKeyOptions : never;
