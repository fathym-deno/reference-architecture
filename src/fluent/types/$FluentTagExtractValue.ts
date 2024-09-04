import type { $TagExtractValue } from "../../common/types/tags/$TagExtractValue.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

export type $FluentTagExtractValue<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValue<T, TType, TTag, TData>;
