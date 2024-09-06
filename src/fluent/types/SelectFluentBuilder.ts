import type { FluentBuilder } from "../FluentBuilder.ts";

/**
 * Used to Select the Fluent builder type to use.
 */
export type SelectFluentBuilder<T, TBuilderModel> = FluentBuilder<
  TBuilderModel
>;

export type ExtractFluentBuilderModel<T> = T extends FluentBuilder<infer U> ? U : never;