import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsObject<
  T,
  K extends keyof T,
  TBuilderModel
> = true extends $FluentTagExtractValue<T[K], 'Methods', 'Object', 'generic'>
  ? <TGeneric extends T[K] = T[K]>() => FluentMethodsObjectReturnType<
      T[K],
      TGeneric,
      TBuilderModel
    >
  : () => FluentMethodsObjectReturnType<T[K], T[K], TBuilderModel>;

type FluentMethodsObjectReturnType<TBuild, TMethods, TBuilderModel> =
  SelectFluentBuilder<$FluentTagStrip<TBuild>, TBuilderModel> &
    SelectFluentMethods<$FluentTagStrip<TMethods>, TBuilderModel>;
