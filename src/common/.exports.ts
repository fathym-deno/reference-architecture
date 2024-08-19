/**
 * Common reference architecture and cross cutting concerns.
 * @module
 *
 * @example Version Deno task script
 * ```command prompt
 * deno run -A jsr:@fathym/common/build/version -- 0.0.0
 * ```
 *
 * @example Queue from direct import
 * ```typescript
 * import { Queue } from "@fathym/common/iterables";
 *
 * const queue = new Queue<number>();
 *
 * queue.Enqueue(1);
 *
 * queue.Enqueue(2);
 *
 * queue.Dequeue(); // Output: 1
 *
 * queue.Peek(); // Output: 2
 *
 * queue.Dequeue(); // Output: 2
 *
 * queue.IsEmpty(); // Output: true
 * ```
 * 
 * @example Merge from direct import
 * ```typescript
 * import { merge } from '@fathym/common/merge';
 *
 * const merged = merge({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [4, 5, 6] }
 * ```
 * 
 * @example Exists from direct import
 * ```typescript
 * import { exists } from '@fathym/common/path';
 *
 * if (await exists('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 */
export * from './http/.exports.ts';
export * from './iterables/.exports.ts';
export * from './jwt/.exports.ts';
export * from './merge/.exports.ts';
export * from './path/.exports.ts';
export * from './types/.exports.ts';
export * from "./BaseRequest.ts";
export * from "./BaseResponse.ts";
export * from "./Pageable.ts";
export * from './Status.ts';
