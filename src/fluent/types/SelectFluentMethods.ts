// deno-lint-ignore-file ban-types
import type {
  IncrementDepth,
  NoPropertiesUndefined,
  NormalizeNever,
  RemoveIndexSignatures,
} from '../.deps.ts';
import type { DetermineEaCFluentMethods } from './DetermineEaCFluentMethods.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

/**
 * `SelectFluentMethods<T, TBuilderModel>` processes a type `T` and selects the appropriate Fluent methods based on the type of the properties.
 *
 * - It renames properties based on their determined method type:
 *   - If the property type is identified as a `Record`, it renames the property with an underscore prefix (`_`).
 *   - If the property type is an `Object` or `Property`, it keeps the original name.
 * - The method type is determined using the `DetermineFluentMethodsType` utility type.
 * - The methods for each property are selected using `DetermineEaCFluentMethods`.
 * - Properties that are `undefined` or have undefined values are excluded using `NoPropertiesUndefined`.
 *
 * ### Parameters:
 * - `T`: The input type representing the object to be processed.
 * - `TBuilderModel`: The model that guides how the fluent methods are selected for each property in `T`.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type Example = {
 *   details: {
 *     compile: () => void;
 *   };
 *   items: Record<string, number>;
 * };
 *
 * type Processed = SelectFluentMethods<Example, BuilderModel>;
 * // Result: {
 * //   details: ReturnType<DetermineEaCFluentMethods<Example, 'details', BuilderModel>>,
 * //   _items: ReturnType<DetermineEaCFluentMethods<Example, 'items', BuilderModel>>,
 * // }
 * ```
 *
 * #### Complex Nested Types:
 * ```ts
 * type NestedExample = {
 *   metadata: {
 *     save: () => void;
 *   };
 *   values: {
 *     data: Record<string, string>;
 *   };
 * };
 *
 * type ProcessedNested = SelectFluentMethods<NestedExample, BuilderModel>;
 * // Result: {
 * //   metadata: ReturnType<DetermineEaCFluentMethods<NestedExample, 'metadata', BuilderModel>>,
 * //   _values: ReturnType<DetermineEaCFluentMethods<NestedExample, 'values', BuilderModel>>,
 * // }
 * ```
 */
export type SelectFluentMethods<
  T,
  TBuilderModel,
  Depth extends number = 0,
  TParent = never,
  TKey extends keyof TParent = never,
  TKeys extends keyof T = keyof T
> = NormalizeNever<
  Depth extends 10
    ? never // Stop recursion if depth exceeds 20
    : T extends infer U
    ? TKeys extends keyof U
      ? $FluentTagStrip<
          NoPropertiesUndefined<
            DetermineEaCFluentMethods<
              T,
              TParent,
              TKey,
              TBuilderModel,
              IncrementDepth<Depth>
            >
          >,
          'Methods'
        >
      : never
    : never,
  {}
>;

export type SelectFluentMethodsForKeys<
  T,
  TBuilderModel,
  Depth extends number
  // TKeys extends keyof T = keyof T
> = T extends infer U
  ? // ? TKeys extends keyof U
    {
      [K in keyof U as K extends [never] ? never : K]: NonNullable<SelectFluentMethods<
      U[K],
      TBuilderModel,
      IncrementDepth<Depth>,
      U,
      K
    >>;
    }
  : // : never
    never;
