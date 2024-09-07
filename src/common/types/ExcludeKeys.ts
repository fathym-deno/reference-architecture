/**
 * `ExcludeKeys<T, TKey>` is a TypeScript utility type that constructs a new type by
 * excluding properties from the original type `T` that match the key type `TKey`.
 *
 * This is particularly useful when you want to remove certain properties from a type
 * based on their key name, allowing for more flexible type manipulation in complex scenarios.
 *
 * @template T - The source object type from which properties will be excluded.
 * @template TKey - A string or union of strings representing the property keys that
 * should be excluded from type `T`. Any key in `T` that extends `TKey` will be omitted
 * in the resulting type.
 *
 * @example
 * // Basic Example
 * type OriginalType = { a: string; b: number; c: boolean };
 * type Excluded = ExcludeKeys<OriginalType, 'b'>;
 * // Resulting Type: { a: string; c: boolean }
 *
 * @example
 * // Union of keys
 * type OriginalType = { a: string; b: number; c: boolean; d: string };
 * type Excluded = ExcludeKeys<OriginalType, 'b' | 'c'>;
 * // Resulting Type: { a: string; d: string }
 *
 * @example
 * // Intersection with `keyof` operator
 * type OriginalType = { a: string; b: number; c: boolean };
 * type Excluded = ExcludeKeys<OriginalType, keyof { b: number; c: boolean }>;
 * // Resulting Type: { a: string }
 *
 * @note This utility only excludes keys based on their string name and not their type values.
 * If you need to exclude properties based on their type, consider using a different utility.
 *
 * @remarks
 * - Handles simple key exclusions effectively.
 * - For more complex scenarios involving union or intersection types,
 *   additional type handling may be required to achieve desired behavior.
 */
export type ExcludeKeys<T, TKey extends keyof T | string> = T extends infer U
  ? {
    [K in keyof U as K extends TKey ? never : K]: U[K];
  }
  : T;
