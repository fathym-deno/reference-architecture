import type { ExcludeKeys } from "../types/ExcludeKeys.ts";
import type { ExcludeKeysByPrefix } from "../types/ExcludeKeysByPrefix.ts";
import type { $TagExists } from "./$TagExists.ts";

/**
 * Utility type to remove $Tag and metadata from a single property
 */
// export type $TagStrip<
//   T,
//   TType extends string,
//   TTag = unknown,
//   TData extends string = never,
//   TExact extends boolean = false
// > = false extends $TagExists<T, TType, TTag>
//   ? T
//   : [TData] extends [never]
//   ? true extends TExact
//     ? ExcludeKeys<T, `@${TType}`>
//     : ExcludeKeysByPrefix<T, `@${TType}`>
//   : ExcludeKeysByPrefix<T, `@${TType}-${TData}`>;
export type $TagStrip<
  T,
  TType extends string,
  TTag = never,
  TData extends string = never,
  TExact extends boolean = false,
> = false extends $TagExists<T, TType, TTag> ? T
  : [TData] extends [never] ? true extends TExact ? ExcludeKeys<T, `@${TType}`>
    : ExcludeKeysByPrefix<T, `@${TType}`>
  : ExcludeKeysByPrefix<T, `@${TType}-${TData}`>;