import type { DetermineDefaultFluentMethodsType } from "./DetermineDefaultFluentMethodsType.ts";
import type { $FluentTagExtract } from "./tags/$FluentTagExtract.ts";

/**
 * Determines the Fluent Methods type from any tag that has been assigned to T, falling back to a default type based on the shape of T.
 */
export type DetermineFluentMethodsType<
  T,
  K extends keyof T,
> = $FluentTagExtract<T[K], "Methods"> extends [never]
  ? DetermineDefaultFluentMethodsType<T, K>
  : $FluentTagExtract<T[K], "Methods">;
