import type { IsMatched } from "./IsMatched.ts";
import type { NormalizeNever } from "./NormalizeNever.ts";

/**
 * `MatchSwitch<Condition, Matched, NotMatched, MatchAll>` evaluates the provided `Condition`.
 * It breaks down unions in `Condition` using `infer U`, and then checks if all or any types
 * match using the `IsMatched` type.
 *
 * If `MatchAll` is `true`, it checks if all types in `Condition` match the criteria using `IsMatched`.
 * If `MatchAll` is `false`, it checks if at least one type in `Condition` matches.
 * Depending on the result, it either returns `Matched` or `NotMatched`.
 *
 * @template Condition - The type or union of types to evaluate.
 * @template Matched - The type to return if the `Condition` matches.
 * @template NotMatched - The type to return if the `Condition` does not match.
 * @template MatchAll - A boolean indicating whether all (`true`) or any (`false`) matches should be checked.
 *
 * @example
 * // If at least one type in `Condition` matches, return Matched
 * type Example1 = MatchSwitch<true | false, 'Matched', 'NotMatched', false>; // 'Matched'
 *
 * @example
 * // If all types in `Condition` match, return Matched
 * type Example2 = MatchSwitch<true | true, 'Matched', 'NotMatched', true>; // 'Matched'
 *
 * @example
 * // If at least one type does not match, return NotMatched
 * type Example3 = MatchSwitch<true | false, 'Matched', 'NotMatched', true>; // 'NotMatched'
 *
 * @example
 * // Works with more complex types like objects and arrays
 * type Example4 = MatchSwitch<{ a: string } | { b: number }, 'Matched', 'NotMatched', false>; // 'Matched'
 */
export type MatchSwitch<
  Condition,
  Matched,
  NotMatched,
  MatchAll extends boolean = false,
> = Condition extends infer U // Infer the type to split out unions
  ? true extends IsMatched<
    NormalizeNever<U> extends boolean ? NormalizeNever<U> : false,
    MatchAll
  > ? Matched
  : NotMatched
  : NotMatched;
