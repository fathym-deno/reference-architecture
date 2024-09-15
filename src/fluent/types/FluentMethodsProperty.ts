// deno-lint-ignore-file ban-types
import {
  NormalizeNever,
  NormalizePrimitive,
  UnionToIntersection,
} from '../.deps.ts';
import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type {
  SelectFluentMethods,
  SelectFluentMethodsForKeys,
} from './SelectFluentMethods.ts';
import type { $FluentTagDeepStrip } from './tags/$FluentTagDeepStrip.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';

/**
 * Used for managing the property as it's value type.
 */
export type FluentMethodsProperty<
  T,
  TParent,
  TKey extends keyof TParent,
  TBuilderModel,
  Depth extends number
> = NormalizePrimitive<T> extends infer U
  ? NormalizeNever<
      true extends $FluentTagExtractValue<U, 'Methods', 'generic'>
        ? FluentMethodsPropertyGenericMethod<
            U,
            TParent,
            TKey,
            TBuilderModel,
            Depth
          >
        : FluentMethodsPropertyNonGenericMethod<
            U,
            TParent,
            TKey,
            TBuilderModel,
            Depth
          >,
      {}
    >
  : never;

export type FluentMethodsPropertyGenericMethod<
  T,
  TParent,
  TKey extends keyof TParent,
  TBuilderModel,
  Depth extends number
> = <TGeneric extends T>( //$FluentTagDeepStrip<T, 'Methods'>>(
  input: TGeneric
) => FluentMethodsPropertyReturnType<TParent, TKey, TBuilderModel, Depth>;

export type FluentMethodsPropertyNonGenericMethod<
  T,
  TParent,
  TKey extends keyof TParent,
  TBuilderModel,
  Depth extends number
> = (
  input: T //$FluentTagDeepStrip<T, 'Methods'>
) => FluentMethodsPropertyReturnType<TParent, TKey, TBuilderModel, Depth>;

export type FluentMethodsPropertyReturnType<
  T,
  TKey extends keyof T,
  TBuilderModel,
  Depth extends number
> = SelectFluentBuilder<TBuilderModel> &
  SelectFluentMethods<
    Omit<T, TKey>,
    TBuilderModel,
    Depth,
    keyof Omit<T, TKey>
  > &
  SelectFluentMethodsForKeys<Omit<T, TKey>, TBuilderModel, Depth> &
  $FluentTagLoadHandlers<T>;
