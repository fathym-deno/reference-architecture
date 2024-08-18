/**
 * This is a simple implementation of a queue data structure.
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
 * @example From common import
 * import { Queue } from "@fathym/common";
 *
 * const queue = new Queue<number>();
 *
 * queue.Enqueue(1); // Output: 1
 *
 * queue.Enqueue(2); // Output: 2
 *
 * queue.Dequeue(); // Output: 1
 *
 * queue.Dequeue(); // Output: 2
 */
export class Queue<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Used to add an item to the end of the queue.
   *
   * @param item The item to add to the queue.
   *
   * @example Enqueue Item
   * queue.enqueue(1);
   */
  public Enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Used to remove and return the item at the front of the queue.
   *
   * @returns The item at the front of the queue, or undefined if the queue is empty.
   *
   * @example Dequeue Item
   * const item = queue.dequeue();
   */
  public Dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * Used to return the item at the front of the queue without removing it.
   *
   * @returns The item at the front of the queue, or undefined if the queue is empty.
   *
   * @example Peek Item
   * const item = queue.peek();
   */
  public Peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Used to check if the queue is empty.
   *
   * @returns true if the queue is empty, false otherwise.
   *
   * @example Check if Queue is Empty
   * queue.isEmpty(); // Output: true
   */
  public IsEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Used to get the number of items in the queue.
   *
   * @returns The number of items in the queue.
   *
   * @example Get Queue Size
   * const size = queue.size();
   */
  public Size(): number {
    return this.items.length;
  }
}
