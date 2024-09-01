/**
 * Used to ensure a type where all properties are not undefined.
 */

export type NoPropertiesUndefined<T> = {
  [K in keyof T]-?: T[K] extends object ? NoPropertiesUndefined<T[K]>
    : T[K] extends undefined ? never
    : T[K];
};
