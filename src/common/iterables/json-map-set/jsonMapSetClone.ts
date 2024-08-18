// deno-lint-ignore-file no-explicit-any
import { jsonMapSetParse } from "./jsonMapSetParse.ts";
import { jsonMapSetStringify } from "./jsonMapSetStringify.ts";

/**
 * Clones a value with Map/Set replacer and reviver applied.
 *
 * @param value The value to clone with Map/Set replacer and reviver.
 * @returns The cloned value with Map/Set replacer and reviver applied.
 *
 * @example From direct import
 * ```typescript
 * import { jsonMapSetClone } from "@fathym/common/iterables";
 *
 * const map = new Map([["a", 1], ["b", 2]]);
 *
 * const set = new Set([1, 2, 3]);
 *
 * const obj = jsonMapSetClone({ map, set });
 * ```
 *
 * @example From common import
 * ```typescript
 * import { jsonMapSetClone } from "@fathym/common";
 *
 * const map = new Map([["a", 1], ["b", 2]]);
 *
 * const set = new Set([1, 2, 3]);
 *
 * const obj = jsonMapSetClone({ map, set });
 * ```
 */
export function jsonMapSetClone<T>(value: T): T {
  if (value && "$target" in (value as any)) {
    value = (value as any).$target;
  }

  return value ? jsonMapSetParse(jsonMapSetStringify(value)) : value;
}
