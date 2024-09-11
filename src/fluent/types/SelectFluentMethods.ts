import type { NoPropertiesUndefined } from "../.deps.ts";
import type { DetermineEaCFluentMethods } from "./DetermineEaCFluentMethods.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * `SelectFluentMethods<T, TBuilderModel>` processes a type `T` and selects the appropriate Fluent methods based on the type of the properties.
 *
 * - It renames properties based on their determined method type:
 *   - If the property type is identified as a `Record`, it renames the property with an underscore prefix (`_`).
 *   - If the property type is an `Object` or `Property`, it keeps the original name.
 * - The method type is determined using the `DetermineFluentMethodsType` utility type.
 * - The methods for each property are selected using `DetermineEaCFluentMethods`.
 * - Properties that are `undefined` or have undefined values are excluded using `NoPropertiesUndefined`.
 *
 * ### Parameters:
 * - `T`: The input type representing the object to be processed.
 * - `TBuilderModel`: The model that guides how the fluent methods are selected for each property in `T`.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type Example = {
 *   details: {
 *     compile: () => void;
 *   };
 *   items: Record<string, number>;
 * };
 *
 * type Processed = SelectFluentMethods<Example, BuilderModel>;
 * // Result: {
 * //   details: ReturnType<DetermineEaCFluentMethods<Example, 'details', BuilderModel>>,
 * //   _items: ReturnType<DetermineEaCFluentMethods<Example, 'items', BuilderModel>>,
 * // }
 * ```
 *
 * #### Complex Nested Types:
 * ```ts
 * type NestedExample = {
 *   metadata: {
 *     save: () => void;
 *   };
 *   values: {
 *     data: Record<string, string>;
 *   };
 * };
 *
 * type ProcessedNested = SelectFluentMethods<NestedExample, BuilderModel>;
 * // Result: {
 * //   metadata: ReturnType<DetermineEaCFluentMethods<NestedExample, 'metadata', BuilderModel>>,
 * //   _values: ReturnType<DetermineEaCFluentMethods<NestedExample, 'values', BuilderModel>>,
 * // }
 * ```
 */
export type SelectFluentMethods<T, TBuilderModel> = T extends infer U
  ? $FluentTagStrip<
    NoPropertiesUndefined<
      {
        [
          K in keyof U as K extends string
            // ? DetermineFluentMethodsType<U, K> extends "Record" ? `_${K}`
            ? K
            : never
        ]: DetermineEaCFluentMethods<U, K, TBuilderModel>;
      }
    >,
    "Methods"
  >
  : T;

// export type SelectFluentMethods2<T, TBuilderModel> = T extends infer U
//   ? NoPropertiesUndefined<
//     {
//       [
//         K in keyof U as K extends string
//           ? DetermineFluentMethodsType<U, K> extends "Record" ? `_${K}`
//           : K
//           : never
//       ]: SelectFluentMethods2<U[K], TBuilderModel>;
//     } & DetermineEaCFluentMethods2<U, TBuilderModel>
//   >
//   : never;

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
