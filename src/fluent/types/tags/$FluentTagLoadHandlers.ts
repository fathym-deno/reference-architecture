// deno-lint-ignore-file ban-types
import type { $FluentTagExists } from "./$FluentTagExists.ts";
import type { $FluentTagExtractValue } from "./$FluentTagExtractValue.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";

export type $FluentTagLoadHandlers<
  T,
  K extends keyof T,
> = true extends $FluentTagExists<
  T[K],
  "Methods",
  $FluentTagOptions<"Methods">,
  "handlers"
> ? $FluentTagExtractValue<
    T[K],
    "Methods",
    $FluentTagOptions<"Methods">,
    "handlers"
  >
  : {};
