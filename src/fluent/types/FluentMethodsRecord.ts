// deno-lint-ignore-file ban-types
import type {
  HasIndexSignatures,
  NormalizeNever,
  ObjectPropertiesToIntersection,
  ResolveIndexSignatures,
  UnionToIntersection,
} from '../.deps.ts';
import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type {
  SelectFluentMethods,
  SelectFluentMethodsForKeys,
} from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsRecord<
  T,
  TBuilderModel,
  Depth extends number
> = T extends infer U
  ? NormalizeNever<
      ResolveIndexSignatures<U> extends infer V
        ? true extends HasIndexSignatures<V>
          ? ObjectPropertiesToIntersection<{
              [K in keyof V]: true extends $FluentTagExtractValue<
                V[K],
                'Methods',
                'generic'
              >
                ? FluentMethodsRecordGenericMethod<
                    V[K],
                    K,
                    U,
                    TBuilderModel,
                    Depth
                  >
                : FluentMethodsRecordNonGenericMethod<
                    V[K],
                    K,
                    U,
                    TBuilderModel,
                    Depth
                  >;
            }>
          : {}
        : {},
      {}
    >
  : never;

export type FluentMethodsRecordNonGenericMethod<
  T,
  TKey,
  TParent,
  TBuilderModel,
  Depth extends number
> = (
  key: TKey,
  isRecord: true
) => FluentMethodsRecordReturnType<T, TParent, TBuilderModel, Depth>;

export type FluentMethodsRecordGenericMethod<
  T,
  TKey,
  TParent,
  TBuilderModel,
  Depth extends number
> = <
  TGeneric extends T //$FluentTagDeepStrip<ValueType<T[K]>, 'Methods'>
>(
  key: TKey,
  isRecord: true
) => FluentMethodsRecordReturnType<TGeneric, TParent, TBuilderModel, Depth>;

export type FluentMethodsRecordReturnType<
  T,
  THandle,
  TBuilderModel,
  Depth extends number
> = SelectFluentBuilder<TBuilderModel> &
  SelectFluentMethods<T, TBuilderModel, Depth> &
  SelectFluentMethodsForKeys<T, TBuilderModel, Depth> &
  $FluentTagLoadHandlers<THandle>;
