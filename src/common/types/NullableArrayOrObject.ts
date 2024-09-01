// deno-lint-ignore-file no-explicit-any

/**
 * `NullableArrayOrObject` is a utility type that recursively makes all properties
 * of a given type `T` nullable if they are arrays or objects. This type will traverse
 * through each property of `T`, and if the property is an object or an array, it
 * transforms it into a nullable type.
 *
 * @template T - The type whose properties will be transformed.
 *
 * @example Simple Type
 * ```typescript
 * type SimpleType = {
 *   name: string;
 *   age: number;
 *   tags: string[];
 * };
 *
 * // Resulting type:
 * type NullableSimpleType = NullableArrayOrObject<SimpleType>;
 * // {
 * //   name: string;
 * //   age: number;
 * //   tags: string[] | null;
 * // }
 * ```
 *
 * @example Complex Type
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
 * // Resulting type:
 * type NullableComplexType = NullableArrayOrObject<ComplexType>;
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
 * This utility is particularly useful when you need to work with API responses or data
 * that might have optional arrays or nested objects.
 */
export type NullableArrayOrObject<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? U[] | null
    : T[K] extends Record<string | number | symbol, any>
      ? NullableArrayOrObject<T[K]> | null
    : T[K] extends object ? NullableArrayOrObject<T[K]> | null
    : T[K];
};
