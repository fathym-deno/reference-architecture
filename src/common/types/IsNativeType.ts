// deno-lint-ignore-file no-explicit-any
/**
 * Checks if a type `T` is a native type (e.g., Date, Promise, Map, Set, etc.).
 * It ensures that types with generic parameters (e.g., `Promise<string>`) are
 * properly matched to their base type (e.g., `Promise<any>`).
 */
export type IsNativeType<T> = T extends Date ? true
  : T extends Promise<any> ? true
  : T extends Map<any, any> ? true
  : T extends Set<any> ? true
  : T extends WeakMap<any, any> ? true
  : T extends WeakSet<any> ? true
  : false;
