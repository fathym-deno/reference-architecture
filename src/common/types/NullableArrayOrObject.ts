// deno-lint-ignore-file no-explicit-any

import type { RemoveIndexSignatures } from "./RemoveIndexSignatures.ts";
import type { ResolveIndexSignatures } from "./ResolveIndexSignatures.ts";

/**
 * `NullableArrayOrObject` is a utility type that recursively makes all properties
 * of a given type `T` nullable if they are arrays or objects.
 *
 * It will traverse each property of `T`, and if the property is an object or an array,
 * it transforms it into a nullable type (`null`). This is particularly useful when
 * working with data models that have optional or partial arrays or nested objects,
 * such as API responses where some fields may be missing or set to `null`.
 *
 * ### Transformation Rules:
 *
 * 1. If a property is an **array** (e.g., `T[]`), it becomes nullable as `T[] | null`.
 * 2. If a property is a **`Record<string, any>`**, it recursively transforms its properties
 *    and makes the object itself nullable.
 * 3. **Primitive values** and other types that are not arrays or objects remain unchanged.
 *
 * ### Use Cases:
 *
 * This utility type is useful when dealing with complex types that include nested structures
 * (e.g., objects within objects) or arrays, and you want to support scenarios where the data
 * may be partially missing, such as from an API response.
 *
 * ### Examples:
 *
 * #### Example 1: Simple Type with Array
 *
 * ```typescript
 * type SimpleType = {
 *   name: string;
 *   age: number;
 *   tags: string[];
 * };
 *
 * type NullableSimpleType = NullableArrayOrObject<SimpleType>;
 * // Resulting type:
 * // {
 * //   name: string;
 * //   age: number;
 * //   tags: string[] | null;
 * // }
 * ```
 *
 * In this example, the `tags` array becomes nullable (`string[] | null`), while other properties
 * such as `name` and `age` remain unchanged because they are primitive types.
 *
 * #### Example 2: Complex Type with Nested Objects and Arrays
 *
 * ```typescript
 * type ComplexType = {
 *   id: number;
 *   info: {
 *     name: string;
 *     address: {
 *       street: string;
 *       city: string;
 *     };
 *     hobbies: {
 *       name: string;
 *       years: number;
 *     }[];
 *   };
 *   tags: string[];
 * };
 *
 * type NullableComplexType = NullableArrayOrObject<ComplexType>;
 * // Resulting type:
 * // {
 * //   id: number;
 * //   info: {
 * //     name: string;
 * //     address: {
 * //       street: string;
 * //       city: string;
 * //     } | null;
 * //     hobbies: {
 * //       name: string;
 * //       years: number;
 * //     }[] | null;
 * //   } | null;
 * //   tags: string[] | null;
 * // }
 * ```
 *
 * Here, the `info` object becomes nullable (`info | null`), and within `info`,
 * both the `address` object and the `hobbies` array become nullable. Primitive
 * values like `id` and `name` remain unchanged.
 *
 * #### Example 3: Handling Dynamic Record Keys
 *
 * ```typescript
 * type RecordType = Record<string, { key: number; details: { info: string[] } }>;
 *
 * type NullableRecordType = NullableArrayOrObject<RecordType>;
 * // Resulting type:
 * // {
 * //   [key: string]: {
 * //     key: number;
 * //     details: {
 * //       info: string[] | null;
 * //     } | null;
 * //   } | null;
 * // }
 * ```
 *
 * In this example, the `details` object and its `info` array become nullable.
 * The overall record structure is preserved, but each individual object and array
 * can now be `null` as well.
 *
 * ### Important Notes:
 *
 * - This utility only applies nullability to arrays and objects. Primitive types
 *   such as `string`, `number`, and `boolean` are not affected.
 * - It applies nullability to both arrays and objects recursively, so deeply
 *   nested structures will have all relevant properties made nullable.
 *
 * @template T - The type whose properties will be transformed.
 */
// export type NullableArrayOrObject<T> = {
//   [K in keyof T]: T[K] extends (infer U)[]
//     ? (U extends string | number ? T[K] : U[]) | null // Keep array union types intact
//     : T[K] extends Record<string | number | symbol, any>
//       ? NullableArrayOrObject<T[K]> | null
//       : T[K] extends object
//         ? NullableArrayOrObject<T[K]> | null
//         : T[K];
// };

// export type NullableArrayOrObject<T> = {
//   // Process index signatures
//   [K in keyof ResolveIndexSignatures<T>]: NullableArrayOrObject<
//     ResolveIndexSignatures<T>[K]
//   >;
// } & {
//   // Process explicitly defined properties
//   [K in keyof RemoveIndexSignatures<T>]: RemoveIndexSignatures<T>[K] extends (infer U)[]
//     ?
//         | (U[] extends RemoveIndexSignatures<T>[K]
//             ? RemoveIndexSignatures<T>[K]
//             : U[])
//         | null // Preserve union types in arrays
//     : RemoveIndexSignatures<T>[K] extends object
//     ? NullableArrayOrObject<RemoveIndexSignatures<T>[K]> | null
//     : RemoveIndexSignatures<T>[K];
// };

export type NullableArrayOrObject<T> =
  & {
    // Process index signatures
    [K in keyof ResolveIndexSignatures<T>]: NullableArrayOrObject<
      ResolveIndexSignatures<T>[K]
    >;
  }
  & {
    // Process explicitly defined properties
    [K in keyof RemoveIndexSignatures<T>]: RemoveIndexSignatures<T>[K] extends
      (infer U)[]
      ? RemoveIndexSignatures<T>[K] extends any[]
        ? RemoveIndexSignatures<T>[K] | null
      : never // Preserve union of arrays
      : RemoveIndexSignatures<T>[K] extends object
        ? NullableArrayOrObject<RemoveIndexSignatures<T>[K]> | null
      : RemoveIndexSignatures<T>[K];
  };
