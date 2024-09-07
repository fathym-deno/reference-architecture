import type { DetermineEaCFluentMethods } from "./DetermineEaCFluentMethods.ts";
import type { DetermineFluentMethodsType } from "./DetermineFluentMethodsType.ts";

/**
 * Processes a type and selects the Fluent methods for it.
 */
export type SelectFluentMethods<T, TBuilderModel> = {
  [
    K in keyof T as K extends string
      ? DetermineFluentMethodsType<T, K> extends "Record" ? `_${K}`
      : K
      : never
  ]: DetermineEaCFluentMethods<T, K, TBuilderModel>;
};

// import {
//   NoPropertiesUndefined,
//   OptionalProperties,
//   RequiredProperties,
// } from "../.deps.ts";

// export type EaCFluentProperties<T> = RequiredProperties<T> & {
//   Optional: NoPropertiesUndefined<OptionalProperties<T>>;
// };

// type c = IsUndefined<EaCAIDetails['Name']>;
// type cc = IsRequiredProperty<EaCAIDetails, 'Name'>;

// type x = NoPropertiesUndefined<RequiredProperties<EverythingAsCodeSynaptic>>;
// type xx = NoPropertiesUndefined<RequiredProperties<EaCAIAsCode>>;
// type xxx = NoPropertiesUndefined<RequiredProperties<EaCAIDetails>>;

// type y = NoPropertiesUndefined<OptionalProperties<EverythingAsCodeSynaptic>>;
// type yy = NoPropertiesUndefined<OptionalProperties<EaCAIAsCode>>;
// type yyy = NoPropertiesUndefined<OptionalProperties<EaCAIDetails>>;

// export type SelectEaCFluentMethods<T, TEaC extends EverythingAsCode> = {
//   [K in keyof NoPropertiesUndefined<RequiredProperties<T>> as K extends string
//     ? K
//     : never]: DetermineEaCFluentMethods<T, K, TEaC>;
// } & {
//   $Optional: {
//     [K in keyof NoPropertiesUndefined<OptionalProperties<T>> as K extends string
//       ? K
//       : never]: DetermineEaCFluentMethods<T, K, TEaC>;
//   };
// };
