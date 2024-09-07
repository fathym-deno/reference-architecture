/**
 * `ResolveIndexSignatures<T>` is a TypeScript utility type that constructs a new type by
 * resolving and retaining any index signatures from the original type `T`, while excluding
 * explicitly defined keys.
 *
 * This is useful when you want to filter out explicitly defined keys and focus on
 * resolving index signatures in the resulting type.
 *
 * @template T - The source object type from which explicitly defined keys will be excluded.
 *
 * @example
 * // Basic Example
 * type Original = { [key: string]: any; id: number; name: string };
 * type Resolved = ResolveIndexSignatures<Original>;
 * // Resulting Type: { [key: string]: any }
 *
 * @example
 * // Simple Record Type
 * type RecordType = Record<string, string>;
 * type Resolved = ResolveIndexSignatures<RecordType>;
 * // Resulting Type: Record<string, string>
 *
 * @example
 * // Complex Record Type
 * type ComplexRecord = Record<string, { a: number; b: string }>;
 * type Resolved = ResolveIndexSignatures<ComplexRecord>;
 * // Resulting Type: Record<string, { a: number; b: string }>
 *
 * @example
 * // Mixed Explicit and Index Signature
 * type MixedType = { id: number; data: Record<string, string> };
 * type Resolved = ResolveIndexSignatures<MixedType>;
 * // Resulting Type: Record<string, string>
 */
export type ResolveIndexSignatures<T> = T extends infer U ? {
    [K in keyof U as K extends `${infer _}` ? never : K]: T[K];
  }
  : never;
