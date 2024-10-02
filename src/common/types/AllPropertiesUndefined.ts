// deno-lint-ignore-file no-explicit-any
import type { IsNativeType } from "./IsNativeType.ts";

export type AllPropertiesUndefined<T> =
  // // Handle tuples (fixed-length arrays)
  // T extends [infer A, ...infer B] ? B extends [] ? [AllPropertiesUndefined<A>]
  //   : [AllPropertiesUndefined<A>, ...AllPropertiesUndefined<B>]
  //   : T extends (infer U)[]
  //   // Handle arrays
  //     ? AllPropertiesUndefined<U>[]
  //   // deno-lint-ignore no-explicit-any
  //   :
  T extends (...args: any[]) => any
    // Skip functions
    ? T
    : T extends Promise<infer U>
    // Handle Promises by unwrapping the inner type and applying AllPropertiesUndefined
      ? Promise<AllPropertiesUndefined<U>>
    : IsNativeType<T> extends true
    // If it's a native type, skip processing
      ? T
    : T extends object
    // Process objects recursively
      ? { [K in keyof T]?: AllPropertiesUndefined<T[K]> }
    : T;
