import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

/**
 * Used for managing the property as it's value type.
 */
export type FluentMethodsProperty<
  T,
  K extends keyof T,
  TBuilderModel
> = true extends $FluentTagExtractValue<T[K], 'Methods', 'Property', 'generic'>
  ? <TGeneric extends T[K] = T[K]>(
      input: $FluentTagStrip<TGeneric>
    ) => FluentMethodsPropertyReturnType<T[K], T, K, TBuilderModel>
  : (
      input: $FluentTagStrip<T[K]>
    ) => FluentMethodsPropertyReturnType<T[K], T, K, TBuilderModel>;

type FluentMethodsPropertyReturnType<
  TBuild,
  TMethodsParent,
  TMethodsKey extends keyof TMethodsParent,
  TBuilderModel
> = SelectFluentBuilder<$FluentTagStrip<TBuild>, TBuilderModel> &
  SelectFluentMethods<
    Omit<$FluentTagStrip<TMethodsParent>, TMethodsKey>,
    TBuilderModel
  >;
