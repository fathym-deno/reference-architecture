// deno-lint-ignore-file ban-types
import { Tokens } from 'jsr:@deno/kv-oauth@0.11.0';
import type {
  ExtractExact,
  ExtractKeysByPrefix,
  IsObjectNotNative,
  RemoveIndexSignatures,
  ValueType,
} from '../.deps.ts';
import { DetermineEaCFluentMethods } from './DetermineEaCFluentMethods.ts';
import { DetermineFluentMethodsType } from './DetermineFluentMethodsType.ts';
import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';
import { $FluentTagOptions } from './tags/$FluentTagOptions.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';
import { $FluentTagTypeOptions } from './tags/$FluentTagTypeOptions.ts';
import { FluentMethodsObjectReturnType } from './FluentMethodsObject.ts';
import { FluentMethodsPropertyReturnType } from './FluentMethodsProperty.ts';

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsRecord<
  T,
  K extends keyof T,
  TBuilderModel
> = (RemoveIndexSignatures<$FluentTagStrip<T>> extends infer U
  ? K extends keyof U
    ? true extends $FluentTagExtractValue<U[K], 'Methods', 'generic'>
      ? <TGeneric extends ValueType<U[K]> = ValueType<U[K]>>(
          key: string
        ) => FluentMethodsRecordReturnType<U, K, TGeneric, TBuilderModel> &
          $FluentTagLoadHandlers<TGeneric>
      : (
          key: string
        ) => FluentMethodsRecordReturnType<
          U,
          K,
          ValueType<U[K]>,
          TBuilderModel
        > &
          $FluentTagLoadHandlers<ValueType<U[K]>>
    : never
  : T) &
  (ExtractKeysByPrefix<T[K], '$'> extends infer U
    ? SelectFluentMethods<U, TBuilderModel>
    : {}) &
  $FluentTagLoadHandlers<T[K]>;

export type FluentMethodsRecordReturnType<
  T,
  K extends keyof T,
  TMethods,
  TBuilderModel
> =
  SelectFluentMethods<T, TBuilderModel>;
  // keyof TMethods extends [never]
  //   ? {}
  //   : SelectFluentBuilder<TBuilderModel> &
  //       (true extends IsObjectNotNative<TMethods>
  //         ? DetermineFluentMethodsType<T, K> extends infer MethodType
  //           ? MethodType extends ExtractExact<
  //               $FluentTagOptions<'Methods'>,
  //               'Object'
  //             >
  //             ? FluentMethodsObjectReturnType<TMethods, TBuilderModel>
  //             : string //DetermineEaCFluentMethods<T[K], TMethods, TBuilderModel>
  //           : false
  //         : FluentMethodsPropertyReturnType<TMethods, TBuilderModel>);

type x = { [K in keyof RemoveIndexSignatures<Record<string, string>>]: true };

//     export type FluentMethodsRecordReturnType<
//   T,
//   K extends keyof T,
//   TMethods,
//   TBuilderModel,
// > =
//   & SelectFluentBuilder<
//     TBuilderModel
//   >
//   & SelectFluentMethods<$FluentTagStrip<TMethods>, TBuilderModel>
//   & // SelectFluentMethods<TMethods, TBuilderModel> &
//   $FluentTagLoadHandlers<T[K]>;
