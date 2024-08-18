// deno-lint-ignore-file no-explicit-any
import { jsonMapSetReplacer } from "./jsonMapSetReplacer.ts";

/**
 * Stringifies a value with Map/Set replacer applied.
 *
 * @param value The value to stringify with Map/Set replacer.
 * @returns The stringified value.
 *
 * @example From direct import
 * ```typescript
 * import { jsonMapSetStringify } from "@fathym/common/iterables";
 *
 * const obj = jsonMapSetStringify({});
 * ```
 *
 * @example From common import
 * ```typescript
 * import { jsonMapSetStringify } from "@fathym/common";
 *
 * const obj = jsonMapSetStringify({});
 * ```
 */
export function jsonMapSetStringify<T>(value: T): string {
  if (value && "$target" in (value as any)) {
    value = (value as any).$target;
  }

  return value ? JSON.stringify(value, jsonMapSetReplacer) : "";
}
