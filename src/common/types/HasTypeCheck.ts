import type { RemoveIndexSignature } from './RemoveIndexSignature.ts';

/**
 * Determine if a type extends another type.
 */
export type HasTypeCheck<T, U> = RemoveIndexSignature<T> extends RemoveIndexSignature<U>
  ? true
  : false;
