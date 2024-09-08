import type { ValueType } from "../../common/types/ValueType.ts";
import type { $FluentTagDataValueTypesOptions } from "./tags/$FluentTagDataValueOptions.ts";

/**
 * `FluentBuilderMethodsHandlers` extracts and enforces strong typing for handler functions from
 * a `$FluentTagDataValueTypesOptions<"Methods", "handlers">` tag.
 *
 * This type maps handler names to their corresponding function signatures, allowing for strict
 * type checking in Fluent Builder patterns where handlers are dynamically defined.
 *
 * ### Parameters:
 * - `handlerName`: A dynamic string key representing each handler name.
 * - `ValueType`: The function signature extracted from `$FluentTagDataValueTypesOptions` associated
 * with the `"Methods"` tag and the `"handlers"` data key.
 *
 * This type is commonly used to map handler functions to specific actions in a strongly-typed way,
 * ensuring type-safe operations for method invocation.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type Handlers = FluentBuilderMethodsHandlers;
 * // Result: { [handlerName: string]: (...args: any[]) => any }
 * ```
 *
 * #### Complex Handler Example:
 * ```ts
 * type ComplexHandlers = FluentBuilderMethodsHandlers & {
 *   execute: () => void;
 *   validate: (input: string) => boolean;
 * };
 * // Result: { [handlerName: string]: (...args: any[]) => any, execute: () => void, validate: (input: string) => boolean }
 * ```
 *
 * #### Record Types Example:
 * ```ts
 * type HandlersRecord = Record<string, FluentBuilderMethodsHandlers>;
 * // Result: Record<string, { [handlerName: string]: (...args: any[]) => any }>
 * ```
 *
 * This setup allows strict type checking of handler definitions, ensuring that handlers comply with
 * the specified types in the Fluent Builder's configuration.
 */
export type FluentBuilderMethodsHandlers = {
  [handlerName: string]: ValueType<
    $FluentTagDataValueTypesOptions<"Methods", "handlers">
  >;
};
