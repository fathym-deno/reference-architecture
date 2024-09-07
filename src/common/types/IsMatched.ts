/**
 * `IsMatched<Matches, MatchAll>` evaluates whether all matches in `Matches` are `true` if `MatchAll` is `true`,
 * or whether at least one match is `true` if `MatchAll` is `false`.
 *
 * It treats `never` as `false` by first converting any `never` in `Matches` to `false`.
 *
 * @template Matches - A boolean or union of booleans to evaluate.
 * @template MatchAll - A boolean indicating whether all (`true`) or any (`false`) matches should be checked.
 */
export type IsMatched<
  Matches extends boolean | never,
  MatchAll extends boolean,
> = MatchAll extends true
  // MatchAll: Ensure that all matches are true
  ? [Matches] extends [never] // Check if Matches is never (an empty union)
    ? false // Treat `never` as `false`
  : false extends Matches // If any result is false, return false
    ? false
  : true // Otherwise, all results are true
  // MatchAny: Ensure that at least one match is true
  : [Matches] extends [never] // Check if Matches is never (an empty union)
    ? false // Treat `never` as `false`
  : true extends Matches // If any result is true, return true
    ? true
  : false; // Otherwise, return false
