import { jsonMapSetReviver } from "./jsonMapSetReviver.ts";

/**
 * Parses a JSON string into a value with Map/Set reviver applied.
 *
 * @param value The value to parse with Map/Set reviver.
 * @returns The parsed object.
 *
 * @example From direct import
 * ```typescript
 * import { jsonMapSetParse } from "@fathym/common/iterables";
 *
 * const obj = jsonMapSetParse('{}');
 * ```
 *
 * @example From common import
 * ```typescript
 * import { jsonMapSetParse } from "@fathym/common";
 *
 * const obj = jsonMapSetParse('{}');
 * ```
 */
export function jsonMapSetParse<T>(value: string): T | undefined {
  return value ? JSON.parse(value, jsonMapSetReviver) : undefined;
}
