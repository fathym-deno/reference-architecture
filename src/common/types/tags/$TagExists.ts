// deno-lint-ignore-file no-explicit-any
import type { HasTypeCheck } from "../HasTypeCheck.ts";
import type { $Tag } from "./$Tag.ts";

/**
 * Check if a $Tag exists with varying optional parameters. Check highlevel type, specific tag, or existing data values.
 */
export type $TagExists<
  T,
  TType extends string,
  TTag = never,
  TData extends string = never,
> = [TData] extends [never] ? HasTypeCheck<
    T,
    $Tag<TType, [TTag] extends [never] ? any : TTag>
  > extends true ? true
  : false
  : false extends HasTypeCheck<
    T,
    $Tag<TType, [TTag] extends [never] ? any : TTag>
  > ? false
  : HasTypeCheck<
    T,
    {
      [K in `@${TType}-${TData}`]: any;
    }
  >;
