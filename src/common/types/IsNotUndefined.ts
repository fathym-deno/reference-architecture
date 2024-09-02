import type { IsUndefined } from "./IsUndefined.ts";

/**
 * Used to determine if a type is not undefined or optionally undefined.
 */
export type IsNotUndefined<T> = IsUndefined<T> extends true ? false : true;
