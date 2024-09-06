import type { ValueType } from "../common/types/ValueType.ts";
import type { $FluentTagDataValueTypesOptions } from "./types/tags/$FluentTagDataValueOptions.ts";

export type FluentBuilderHandlers = {
  [handlerName: string]: ValueType<
    $FluentTagDataValueTypesOptions<"Methods", "handlers">
  >;
};
