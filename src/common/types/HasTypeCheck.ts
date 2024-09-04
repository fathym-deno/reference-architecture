/**
 * Determine if a type extends another type.
 */

export type HasTypeCheck<T, U> = T extends U ? true : false;
