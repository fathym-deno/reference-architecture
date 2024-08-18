/**
 * Helper to assist with iterable operations and management.
 * @module
 *
 * @example From direct import
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
 * 
 * @example From direct import
 * import { Stack } from "@fathym/common/iterables";
 *
 * const stack = new Stack<number>();
 *
 * stack.Push(1);
 *
 * stack.Push(2);
 *
 * stack.Pop(); // Output: 2
 *
 * stack.Peek(); // Output: 1
 *
 * stack.Pop(); // Output: 1
 *
 * stack.IsEmpty(); // Output: true
 */

export * from "./Stack.ts";
export * from "./Queue.ts";
