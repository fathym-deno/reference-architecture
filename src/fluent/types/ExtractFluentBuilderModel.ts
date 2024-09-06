import type { FluentBuilder } from "../FluentBuilder.ts";

export type ExtractFluentBuilderModel<T> = T extends FluentBuilder<infer U> ? U
  : never;
