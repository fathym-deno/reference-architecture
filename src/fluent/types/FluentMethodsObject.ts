import type { RemoveIndexSignatures } from '../.deps.ts';
import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsObject<
  T,
  K extends keyof T,
  TBuilderModel
> = RemoveIndexSignatures<T> extends infer U
  ? K extends keyof U
    ? true extends $FluentTagExtractValue<U[K], 'Methods', 'generic'>
      ? <TGeneric extends U[K] = U[K]>() => FluentMethodsObjectReturnType<
          RemoveIndexSignatures<$FluentTagStrip<TGeneric>>,
          TBuilderModel
        > &
          $FluentTagLoadHandlers<T[K]>
      : () => FluentMethodsObjectReturnType<
          RemoveIndexSignatures<$FluentTagStrip<U[K]>>,
          TBuilderModel
        > &
          $FluentTagLoadHandlers<T[K]>
    : never
  : T;

export type FluentMethodsObjectReturnType<T, TBuilderModel> =
  SelectFluentBuilder<TBuilderModel> & SelectFluentMethods<T, TBuilderModel>;
