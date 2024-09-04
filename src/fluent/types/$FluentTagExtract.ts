import type { $TagExtract } from "../.deps.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

export type $FluentTagExtract<
  T,
  TType extends $FluentTagTypeOptions,
> = $TagExtract<T, TType>;
