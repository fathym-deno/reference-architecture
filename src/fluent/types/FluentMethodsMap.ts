import type { FluentMethodsObject } from "./FluentMethodsObject.ts";
import type { FluentMethodsProperty } from "./FluentMethodsProperty.ts";
import type { FluentMethodsRecord } from "./FluentMethodsRecord.ts";
import { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * A default mapping of method types to their corresponding methods type.
 */
export type FluentMethodsMap<T, K extends keyof T, TBuilderModel> = {
  // AsCode: EaCAsCodeFluentMethods<T, K, TBuilderModel>;
  // Details: EaCDetailsFluentMethods<T, K, TBuilderModel>;
  Object: FluentMethodsObject<T, K, TBuilderModel>;
  Property: FluentMethodsProperty<T, K, TBuilderModel>;
  Record: FluentMethodsRecord<T, K, TBuilderModel>;
};
