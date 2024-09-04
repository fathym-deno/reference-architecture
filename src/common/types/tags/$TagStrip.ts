import type { ExcludeKeys } from "../ExcludeKeys.ts";
import type { ExcludeKeysByPrefix } from "../ExcludeKeysByPrefix.ts";
import type { $TagExists } from "./$TagExists.ts";

/**
 * Utility type to remove $Tag and metadata from a single property
 */
export type $TagStrip<
  T,
  TType extends string,
  TTag = unknown,
  TData extends string = never,
  TExact extends boolean = false,
> = false extends $TagExists<T, TType, TTag> ? false
  : [TData] extends [never] ? true extends TExact ? ExcludeKeys<T, `@${TType}`>
    : ExcludeKeysByPrefix<T, `@${TType}`>
  : ExcludeKeysByPrefix<T, `@${TType}-${TData}`>;
