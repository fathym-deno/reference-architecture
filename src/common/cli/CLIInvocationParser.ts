import type { CLIConfig } from './CLIConfig.ts';

export interface CLIInvocationParser {
  /**
   * Parses the command-line arguments and flags.
   * @param cliConfigPath The path to the CLI config file.
   * @param args The arguments passed to the CLI.
   * @returns The parsed result, including flags, positional arguments, and more.
   */
  ParseInvocation(cliConfigPath: string, args: string[]): Promise<CLIParsedResult>;
}

export type CLIParsedResult = {
  parsed: Record<string, unknown>;
  flags: Record<string, unknown>;
  positional: string[];
  head: string | undefined;
  tail: string | undefined;
  rest: string[];
  key: string | undefined;
  config: CLIConfig;
  baseCommandDir: string;
};
