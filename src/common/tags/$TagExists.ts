import type { $Tag } from "./$Tag.ts";
import type {
  ExtractKeysByPrefix,
  HasKeys,
  HasTypeCheck,
  NoPropertiesUndefined,
} from "./.deps.ts";

/**
 * Check if a $Tag exists with varying optional parameters. Check highlevel type, specific tag, or existing data values.
 */
export type $TagExists<
  T,
  TType extends string,
  TTag = unknown,
  TData extends string = never,
> = false extends HasKeys<tagCheck<TType, TTag, TData>> ? false
  : true extends HasTypeCheck<
    NoPropertiesUndefined<ExtractKeysByPrefix<T, "@">>,
    tagCheck<TType, TTag, TData>
  > ? true
  : false;

type tagCheck<
  TType extends string,
  TTag,
  TData extends string,
> = NoPropertiesUndefined<
  & $Tag<TType, TTag>
  & {
    [K in `@${TType}-${TData}`]: unknown;
  }
>;

// export type $TagExists<
//   T,
//   TType extends string,
//   TTag = never,
//   TData extends string = never
// > = HasKeys<tagCheck<TType, TTag, TData>, ''>;

/**
[TData] extends [never]
  ? HasTypeCheck<
      ExtractKeysByPrefix<T, '@'>,
      $Tag<TType, [TTag] extends [never] ? unknown : TTag>
    > extends true
    ? true
    : false
  : false extends HasTypeCheck<
      ExtractKeysByPrefix<T, '@'>,
      $Tag<TType, [TTag] extends [never] ? unknown : TTag>
    >
  ? false
  : true extends HasTypeCheck<
      ExtractKeysByPrefix<T, '@'>,
      {
        [K in `@${TType}-${TData}`]: unknown;
      }
    >
  ? true
  : false;
 */
