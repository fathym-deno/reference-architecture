import type { $Tag } from "./$Tag.ts";

/**
 * A type used for tagging other types with metadata values, to be used during type inference.
 */
export type $TagValues<
  TType extends string,
  TTag,
  TData extends string = never,
  TValues extends {
    [K in TData extends infer KData ? KData : never]?: unknown;
  } = never,
> = [TData] extends [never] ? $Tag<TType, TTag>
  :
    & $Tag<TType, TTag>
    & {
      [Key in keyof TValues as `@${TType}-${Key & TData}`]?: TValues[Key];
    };
