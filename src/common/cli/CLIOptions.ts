import { CLICommandResolver } from "./CLICommandResolver.ts";
import { CLIInvocationParser } from "./CLIInvocationParser.ts";


export interface CLIOptions {
  resolver?: CLICommandResolver;
  parser?: CLIInvocationParser;
}
