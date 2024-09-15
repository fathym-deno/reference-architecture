// deno-lint-ignore-file ban-types
import type { ExtractKeysByPrefix } from '../../common/types/ExtractKeysByPrefix.ts';
import type { DefaultFluentMethods } from './DefaultFluentMethods.ts';
import type { DetermineFluentMethodsType } from './DetermineFluentMethodsType.ts';
import type { FluentMethodsMap } from './FluentMethodsMap.ts';
import { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from './SelectFluentMethods.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';

export type DetermineEaCFluentMethods<
  T,
  TParent,
  TKey extends keyof TParent,
  TBuilderModel,
  Depth extends number
> = T extends infer U
  ? (DetermineFluentMethodsType<U> extends infer MethodType
      ? MethodType extends keyof FluentMethodsMap<
          U,
          TParent,
          TKey,
          TBuilderModel,
          Depth
        >
        ? FluentMethodsMap<U, TParent, TKey, TBuilderModel, Depth>[MethodType]
        : DefaultFluentMethods<U, TParent, TKey, TBuilderModel, Depth>
      : DefaultFluentMethods<U, TParent, TKey, TBuilderModel, Depth>) &
      // SelectFluentBuilder<TBuilderModel> &
      // (ExtractKeysByPrefix<T, '$'> extends infer TKey
      //   ? TKey extends keyof T
      //     ? SelectFluentMethods<T, TBuilderModel, Depth, TKey>
      //     : {}
      //   : {}) &
      $FluentTagLoadHandlers<T>
  : never;
