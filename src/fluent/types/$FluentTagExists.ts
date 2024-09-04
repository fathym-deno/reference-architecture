import type { $TagExists } from "../../common/types/tags/$TagExists.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

export type $FluentTagExists<
  T,
  TType extends $FluentTagTypeOptions = $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> = $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType> = never,
> = $TagExists<T, TType, TTag, TData>;
