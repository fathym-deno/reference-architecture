/**
 * Used to ensure a type where all properties are not undefined.
 */
export type NoPropertiesUndefined<T> = T extends infer U ? {
    [K in keyof U]-?: NonNullable<U[K]> extends object
      ? NoPropertiesUndefined<NonNullable<U[K]>>
      : NonNullable<U[K]>;
  }
  : NonNullable<T>;
