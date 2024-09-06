import type { NoPropertiesUndefined } from "./NoPropertiesUndefined.ts";
import type { RemoveIndexSignature } from "./RemoveIndexSignature.ts";

/**
 * Determine if a type extends another type.
 */
export type HasTypeCheck<T, U> = NoPropertiesUndefined<T> extends infer V
  ? V extends RemoveIndexSignature<NoPropertiesUndefined<U>> ? true
  : false
  : false;
