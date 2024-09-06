import type { NoPropertiesUndefined } from "./NoPropertiesUndefined.ts";
import type { RemoveIndexSignatures } from "./RemoveIndexSignatures.ts";

/**
 * Determine if a type extends another type.
 */
export type HasTypeCheck<T, U> = NoPropertiesUndefined<T> extends infer V
  ? V extends RemoveIndexSignatures<NoPropertiesUndefined<U>> ? true
  : false
  : false;
