// deno-lint-ignore-file ban-types
import type { $FluentTagExists } from "./$FluentTagExists.ts";
import type { $FluentTagExtractValue } from "./$FluentTagExtractValue.ts";

/**
 * `$FluentTagLoadHandlers<T, K>` extracts the `handlers` from a `$FluentTag` on the `T[K]` property,
 * if they exist, or returns an empty object if not.
 *
 * ### Parameters:
 * - `T`: The input type containing a property `K`.
 * - `K`: The key within `T` that is checked for a `$FluentTag` containing `handlers`.
 *
 * If the tag exists with the type `Methods` and has associated `handlers`, the handlers are extracted.
 * If not, an empty object (`{}`) is returned.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type Example = {
 *   key: {
 *     "@Methods-handlers": { save: () => void };
 *   };
 * };
 *
 * type Handlers = $FluentTagLoadHandlers<Example, "key">;
 * // Result: { save: () => void }
 * ```
 *
 * #### No Handlers:
 * ```ts
 * type NoHandlers = {
 *   key: {
 *     unrelatedKey: number;
 *   };
 * };
 *
 * type Handlers = $FluentTagLoadHandlers<NoHandlers, "key">;
 * // Result: {}
 * ```
 *
 * #### Union Types:
 * ```ts
 * type MixedUnion = {
 *   key: {
 *     "@Methods-handlers": { log: () => void };
 *   };
 * } | {
 *   key: {
 *     unrelatedKey: string;
 *   };
 * };
 *
 * type Handlers = $FluentTagLoadHandlers<MixedUnion, "key">;
 * // Result: { log: () => void } | {}
 * ```
 *
 * #### Record Types:
 * ```ts
 * type RecordType = Record<string, {
 *   "@Methods-handlers": { execute: () => void };
 * }>;
 *
 * type Handlers = $FluentTagLoadHandlers<RecordType, string>;
 * // Result: { execute: () => void }
 * ```
 */
export type $FluentTagLoadHandlers<
  T,
  K extends keyof T,
> = true extends $FluentTagExists<T[K], "Methods", never, "handlers">
  ? $FluentTagExtractValue<T[K], "Methods", "handlers">
  : {};
