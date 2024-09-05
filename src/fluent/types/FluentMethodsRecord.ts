import type { ExcludeKeysByPrefix } from '../../common/types/ExcludeKeysByPrefix.ts';
import type { ValueType } from '../../common/types/ValueType.ts';
import { $Tag } from '../.deps.ts';
import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import { $FluentTag } from './tags/$FluentTag.ts';
import { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

/**
 * Used for managing the property as a Record<,> set where the root object property takes a key for the record, returning a fluent API for each of it's properties.
 */
export type FluentMethodsRecord<
  T,
  K extends keyof T,
  TBuilderModel
> = true extends $FluentTagExtractValue<T[K], 'Methods', 'Record', 'generic'>
  ? <
      TGeneric extends ValueType<
        ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, '$'>
      > = ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, '$'>>
    >(
      key: string
    ) => FluentMethodsRecordReturnType<ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, '$'>>, TGeneric, TBuilderModel>
  : (
      key: string
    ) => FluentMethodsRecordReturnType<
      ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, '$'>>,
      ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, '$'>>,
      TBuilderModel
    >;

type FluentMethodsRecordReturnType<TBuild, TMethods, TBuilderModel> =
  SelectFluentBuilder<TBuild, TBuilderModel> &
    SelectFluentMethods<TMethods, TBuilderModel>;
