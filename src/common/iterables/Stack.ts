/**
 * This is a simple implementation of a stack data structure.
 * @class
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
 *
 * @example From common import
 * import { Stack } from "@fathym/common";
 *
 * const stack = new Stack<number>();
 *
 * stack.Push(1);
 *
 * stack.Push(2);
 *
 * stack.Pop(); // Output: 2
 *
 * stack.Pop(); // Output: 1
 */
export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Used to add an item to the top of the stack.
   * @param item The item to add
   *
   * @example Push Item
   * stack.push(1);
   */
  public Push(item: T): void {
    this.items.push(item);
  }

  /**
   * Used to remove and return the item at the top of the stack.
   *
   * @returns The item at the top of the stack, or undefined if the stack is empty.
   *
   * @example Pop Item
   * const item = stack.pop();
   */
  public Pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Used to return the item at the top of the stack without removing it.
   *
   * @returns The item at the top of the stack, or undefined if the stack is empty.
   *
   * @example Peek Item
   * const nextItem = stack.peek();
   */
  public Peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * Used to check if the stack is empty.
   *
   * @returns true if the stack is empty, false otherwise.
   *
   * @example Check if Stack is Empty
   * stack.isEmpty(); // Output: true
   */
  public IsEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Used to get the number of items in the stack.
   *
   * @returns The number of items in the stack.
   *
   * @example Get Stack Size
   * const size = stack.size();
   */
  public Size(): number {
    return this.items.length;
  }
}
