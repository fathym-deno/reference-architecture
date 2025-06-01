import { levenshtein } from "./levenshtein.ts";

/**
 * Finds the closest fuzzy match using Levenshtein distance.
 */
export function findClosestMatch(
  input: string,
  options: string[],
  maxDistance = 3,
): string | undefined {
  let bestScore = Infinity;
  let bestMatch: string | undefined;

  for (const option of options) {
    const score = levenshtein(input, option);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = option;
    }
  }

  return bestScore <= maxDistance ? bestMatch : undefined;
}
