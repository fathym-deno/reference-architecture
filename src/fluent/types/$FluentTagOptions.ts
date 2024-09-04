import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

export type $FluentTagMethodsOptions = "Record" | "Object" | "Property";

export type $FluentTagOptions<TTagType extends $FluentTagTypeOptions> =
    TTagType extends "Methods" ? $FluentTagMethodsOptions : never;
