import type { $FluentTag } from "./types/tags/$FluentTag.ts";

export type FluentBuilderRoot<TBuilderModel> = { Root: TBuilderModel & $FluentTag<'Methods', 'Object'> };
