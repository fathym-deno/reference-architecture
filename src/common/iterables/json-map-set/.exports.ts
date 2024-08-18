/**
 * JSON serialization functions for Map/Set cloning.
 * @module
 *
 * @example JSON Map/Set clone from direct import
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
 * @example JSON Map/Set parse from direct import
 * ```typescript
 * import { jsonMapSetParse } from "@fathym/common/iterables";
 *
 * const obj = jsonMapSetParse('{}');
 * ```
 *
 * @example JSON Map/Set replacer from direct import
 * ```typescript
 * import { jsonMapSetReplacer } from "@fathym/common/iterables";
 *
 * const objStr = JSON.stringify({}, jsonMapSetReplacer);
 * ```
 *
 * @example JSON Map/Set reviver from direct import
 * ```typescript
 * import { jsonMapSetReviver } from "@fathym/common/iterables";
 *
 * const obj = JSON.parse('{}', jsonMapSetReviver);
 * ```
 *
 * @example JSON Map/Set stringify from direct import
 * ```typescript
 * import { jsonMapSetStringify } from "@fathym/common/iterables";
 *
 * const obj = jsonMapSetStringify({});
 * ```
 */

export * from './jsonMapSetClone.ts';
export * from './jsonMapSetParse.ts';
export * from './jsonMapSetReplacer.ts';
export * from './jsonMapSetReviver.ts';
export * from './jsonMapSetStringify.ts';
