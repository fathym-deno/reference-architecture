import type { CLICommandResolver } from "./CLICommandResolver.ts";
import type { CLIInvocationParser } from "./CLIInvocationParser.ts";

export interface CLIOptions {
  resolver?: CLICommandResolver;
  parser?: CLIInvocationParser;
}
