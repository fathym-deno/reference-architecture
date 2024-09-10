import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

/**
 * Used for managing the property as it's value type.
 */
export type FluentMethodsProperty<
  T,
  K extends keyof T,
  TBuilderModel
> = true extends $FluentTagExtractValue<T[K], 'Methods', 'generic'>
  ? <TGeneric extends T[K] = T[K]>(
      input: $FluentTagStrip<TGeneric>
    ) => FluentMethodsPropertyReturnType<
      Omit<$FluentTagStrip<T>, K>,
      TBuilderModel
    > &
      $FluentTagLoadHandlers<T[K]>
  : (
      input: $FluentTagStrip<T[K]>
    ) => FluentMethodsPropertyReturnType<
      Omit<$FluentTagStrip<T>, K>,
      TBuilderModel
    > &
      $FluentTagLoadHandlers<T[K]>;
// export type FluentMethodsProperty2<
//   T,
//   K extends keyof T,
//   TBuilderModel
// > = true extends $FluentTagExtractValue<T[K], 'Methods', 'generic'>
//   ? <TGeneric extends T[K] = T[K]>(
//       input: $FluentTagStrip<TGeneric>
//     ) => FluentMethodsPropertyReturnType<
//       Omit<$FluentTagStrip<T>, K>,
//       TBuilderModel
//     > &
//       $FluentTagLoadHandlers<T[K]>
//   : (
//       input: $FluentTagStrip<T[K]>
//     ) => FluentMethodsPropertyReturnType<
//       Omit<$FluentTagStrip<T>, K>,
//       TBuilderModel
//     > &
//       $FluentTagLoadHandlers<T[K]>;

export type FluentMethodsPropertyReturnType<T, TBuilderModel> =
  SelectFluentBuilder<TBuilderModel> & SelectFluentMethods<T, TBuilderModel>;
// export type FluentMethodsPropertyReturnType2<T, TBuilderModel> =
//   SelectFluentBuilder<TBuilderModel> & SelectFluentMethods2<T, TBuilderModel>;
