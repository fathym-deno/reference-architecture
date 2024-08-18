// deno-lint-ignore-file no-explicit-any

/**
 * Reviver function for Map/Set parsing.
 *
 * @param _key The key of the json property.
 * @param value The value of the property.
 * @returns The revived value.
 *
 * @example From direct import
 * ```typescript
 * import { jsonMapSetReviver } from "@fathym/common/iterables";
 *
 * const obj = JSON.parse('{}', jsonMapSetReviver);
 * ```
 *
 * @example From common import
 * ```typescript
 * import { jsonMapSetReviver } from "@fathym/common";
 *
 * const obj = JSON.parse('{}', jsonMapSetReviver);
 * ```
 */
export function jsonMapSetReviver(_key: any, value: any): any {
  if (value && typeof value === "object" && "__map__" in value) {
    return new Map(value["__map__"]);
  }
  if (value && typeof value === "object" && "__set__" in value) {
    return new Set(value["__set__"]);
  }
  return value;
}
