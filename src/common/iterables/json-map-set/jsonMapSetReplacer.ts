// deno-lint-ignore-file no-explicit-any

/**
 * Replacer function for Map/Set parsing.
 *
 * @param _key The key of the json property.
 * @param value The value of the property.
 * @returns The replaced value.
 *
 * @example From direct import
 * ```typescript
 * import { jsonMapSetReplacer } from "@fathym/common/iterables";
 *
 * const objStr = JSON.stringify({}, jsonMapSetReplacer);
 * ```
 *
 * @example From common import
 * ```typescript
 * import { jsonMapSetReplacer } from "@fathym/common";
 *
 * const objStr = JSON.stringify({}, jsonMapSetReplacer);
 * ```
 */
export function jsonMapSetReplacer(_key: any, value: any): any {
  if (value && value instanceof Map) {
    return {
      __map__: Array.from(value.entries()),
    };
  }
  if (value && value instanceof Set) {
    return {
      __set__: Array.from(value),
    };
  }
  return value;
}
