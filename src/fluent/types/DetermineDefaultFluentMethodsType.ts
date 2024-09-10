import type {
  ExtractExact,
  HasIndexSignatures,
  IsNativeType,
  IsObject,
  NoPropertiesUndefined,
  ValueType,
} from '../.deps.ts';
import type { IsFluentRecord } from './IsFluentRecord.ts';
import type { $FluentTagExtract } from './tags/$FluentTagExtract.ts';
import type { $FluentTagMethodsOptions } from './tags/$FluentTagOptions.ts';

/**
 * `DetermineDefaultFluentMethodsType<T, K>` determines the appropriate default method type
 * for a given object property based on the type of the property and its value.
 *
 * This type evaluates the following:
 * - If `T[K]` is an object, and `ValueType<T[K]>` is also an object, it checks if the value has index signatures.
 *   - If it has index signatures, it returns `"Object"`.
 *   - Otherwise, it returns `"Record"`.
 * - If `T[K]` is not an object, it returns `"Property"`.
 *
 * ### Parameters:
 * - `T`: The object type containing the property.
 * - `K`: The key of the object property being evaluated.
 *
 * ### Returns:
 * - A string type (`"Object"`, `"Record"`, or `"Property"`) based on the type and structure of `T[K]`.
 *
 * ### Example:
 *
 * #### Simple Object Evaluation:
 * ```ts
 * type Example = {
 *   key: { name: string };
 * };
 * type MethodType = DetermineDefaultFluentMethodsType<Example, 'key'>;
 * // Result: "Object"
 * ```
 *
 * #### Record with Index Signature:
 * ```ts
 * type Example = {
 *   key: Record<string, number>;
 * };
 * type MethodType = DetermineDefaultFluentMethodsType<Example, 'key'>;
 * // Result: "Record"
 * ```
 *
 * #### Simple Property:
 * ```ts
 * type Example = {
 *   key: number;
 * };
 * type MethodType = DetermineDefaultFluentMethodsType<Example, 'key'>;
 * // Result: "Property"
 * ```
 */
export type DetermineDefaultFluentMethodsType<
  T,
  K extends keyof T
> = NoPropertiesUndefined<T> extends infer U
  ? K extends keyof U
    ? false extends IsObject<U[K]>
      ? DetermineDefaultNonObjectFluentMethodsType<U, K>
      : true extends IsNativeType<U[K]>
      ? DetermineDefaultNonObjectFluentMethodsType<U, K>
      : DetermineDefaultObjectFluentMethodsType<U, K>
    : never
  : T;
export type DetermineDefaultFluentMethodsType2<T> =
  NoPropertiesUndefined<T> extends infer U
    ? false extends IsObject<U>
      ? DetermineDefaultNonObjectFluentMethodsType2<U>
      : true extends IsNativeType<U>
      ? DetermineDefaultNonObjectFluentMethodsType2<U>
      : DetermineDefaultObjectFluentMethodsType2<U>
    : T;

export type DetermineDefaultNonObjectFluentMethodsType<
  T,
  K extends keyof T
> = ExtractExact<$FluentTagMethodsOptions, 'Property'>;
export type DetermineDefaultNonObjectFluentMethodsType2<T> = ExtractExact<
  $FluentTagMethodsOptions,
  'Property'
>;

export type DetermineDefaultObjectFluentMethodsType<
  T,
  K extends keyof T
> = $FluentTagExtract<T[K], 'Methods'> extends [never]
  ? false extends IsFluentRecord<T[K]>
    ? DetermineDefaultNonRecordFluentMethodsType<T, K>
    : DetermineDefaultRecordFluentMethodsType<T, K>
  : $FluentTagExtract<T[K], 'Methods'>;
export type DetermineDefaultObjectFluentMethodsType2<T> = $FluentTagExtract<
  T,
  'Methods'
> extends [never]
  ? false extends IsFluentRecord<T>
    ? DetermineDefaultNonRecordFluentMethodsType2<T>
    : DetermineDefaultRecordFluentMethodsType2<T>
  : $FluentTagExtract<T, 'Methods'>;

export type DetermineDefaultNonRecordFluentMethodsType<
  T,
  K extends keyof T
> = ExtractExact<$FluentTagMethodsOptions, 'Object'>;
export type DetermineDefaultNonRecordFluentMethodsType2<
  T
> = ExtractExact<$FluentTagMethodsOptions, 'Object'>;

export type DetermineDefaultRecordFluentMethodsType<
  T,
  K extends keyof T
> = ExtractExact<$FluentTagMethodsOptions, 'Record'>;
export type DetermineDefaultRecordFluentMethodsType2<
  T
> = ExtractExact<$FluentTagMethodsOptions, 'Record'>;
// TODO: Swapping in this logic make it so that records that are parents to records will resolve as objects
// false extends IsFluentRecord<ValueType<T[K]>>
//   ? ExtractExact<$FluentTagMethodsOptions, "Record">
//   : ExtractExact<$FluentTagMethodsOptions, "Object">;

// type temp<T, K extends keyof T> = false extends IsObject<T[K]>
//   ? ExtractExact<$FluentTagMethodsOptions, 'Property'>
//   : true extends IsObject<ValueType<T[K]>>
//   ? true extends HasIndexSignatures<ValueType<T[K]>>
//     ? $FluentTagExtract<ValueType<T[K]>, 'Methods'> extends [never]
//       ? ExtractExact<$FluentTagMethodsOptions, 'Object'>
//       : $FluentTagExtract<ValueType<T[K]>, 'Methods'> extends ['Object']
//       ? ExtractExact<$FluentTagMethodsOptions, 'Object'>
//       : ExtractExact<$FluentTagMethodsOptions, 'Record'>
//     : ExtractExact<$FluentTagMethodsOptions, 'Record'>
//   : true extends HasIndexSignatures<ValueType<T[K]>>
//   ? ExtractExact<$FluentTagMethodsOptions, 'Object'>
//   : [ValueType<T[K]>] extends [unknown]
//   ? ExtractExact<$FluentTagMethodsOptions, 'Record'>
//   : ExtractExact<$FluentTagMethodsOptions, 'Object'>;
