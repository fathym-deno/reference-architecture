import type { IsObject } from "../.deps.ts";

/**
 * Determines if an intial input is able to be used in a FluentBuilder.
 */
export type IsFluentBuildable<TBuilderModel> = IsObject<TBuilderModel> extends
  true ? TBuilderModel : never;
