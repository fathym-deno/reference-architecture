/**
 * Extract from Tag those types that are assignable to T (with strong typing).
 */

export type ExtractExact<T, Tag extends T> = Extract<Tag, T>;
