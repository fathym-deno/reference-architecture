import type { IsNativeType } from "./IsNativeType.ts";
import type { IsObject } from "./IsObject.ts";

export type IsObjectNotNative<T> = false extends IsObject<NonNullable<T>>
  ? false
  : true extends IsNativeType<NonNullable<T>> ? false
  : true;
