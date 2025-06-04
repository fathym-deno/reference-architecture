import type { CommandParamConstructor } from "./CommandParams.ts";
import type { CommandRuntime } from "./CommandRuntime.ts";
import type { TemplateLocator } from "../TemplateLocator.ts";

export type CommandMatch = {
  Command: CommandRuntime | undefined;
  Flags: Record<string, unknown>;
  Args: string[];
  Params: CommandParamConstructor | undefined;
  Templates: TemplateLocator | undefined;
};
