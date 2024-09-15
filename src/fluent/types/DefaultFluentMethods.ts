import type { FluentMethodsMap } from './FluentMethodsMap.ts';

/**
 * The default Fluent Methods type.
 */
export type DefaultFluentMethods<
  T,
  TParent,
  TKey extends keyof TParent,
  TBuilderModel,
  Depth extends number
> = FluentMethodsMap<T, TParent, TKey, TBuilderModel, Depth>['Property'];
