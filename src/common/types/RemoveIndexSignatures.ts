/**
 * `RemoveIndexSignatures<T>` is a TypeScript utility type that constructs a new type by
 * removing index signatures (string, number, and symbol) from the original type `T`.
 *
 * This utility is useful when you want to exclude index signatures and retain only
 * explicitly defined keys in the resulting type.
 *
 * @template T - The source object type from which index signatures will be excluded.
 *
 * @example
 * // Removing string index signature
 * type Original = { [key: string]: any; id: number; name: string };
 * type Cleaned = RemoveIndexSignatures<Original>;
 * // Resulting Type: { id: number; name: string }
 *
 * @example
 * // Simple Record Type
 * type SimpleRecord = Record<string, string>;
 * type Cleaned = RemoveIndexSignatures<SimpleRecord>;
 * // Resulting Type: {}
 *
 * @example
 * // Complex Record Type
 * type ComplexRecord = Record<string, { a: number; b: string }>;
 * type Cleaned = RemoveIndexSignatures<ComplexRecord>;
 * // Resulting Type: {}
 *
 * @example
 * // Nested Record Type
 * type NestedRecord = Record<string, Record<string, { id: number }>>;
 * type Cleaned = RemoveIndexSignatures<NestedRecord>;
 * // Resulting Type: {}
 */
export type RemoveIndexSignatures<T> = T extends infer U ? {
    [K in keyof U as K extends `${infer _}` ? K : never]: T[K];
  }
  : never;
