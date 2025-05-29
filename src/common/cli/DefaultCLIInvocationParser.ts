// DefaultCLIInvocationParser.ts

import { dirname, parseArgs, resolve } from './.deps.ts';
import type { CLIInvocationParser, CLIParsedResult } from './CLIInvocationParser.ts';
import type { CLIConfig } from './CLIConfig.ts';

/**
 * Default implementation of the CLIInvocationParser interface.
 * This class handles parsing command-line arguments and flags.
 */
export class DefaultCLIInvocationParser implements CLIInvocationParser {
  /**
   * Parses the CLI invocation to extract flags, arguments, and the configuration.
   * @param cliConfigPath Path to the CLI config file.
   * @param args The arguments passed to the CLI.
   * @returns The parsed result.
   */
  public async ParseInvocation(cliConfigPath: string, args: string[]): Promise<CLIParsedResult> {
    const parsed = parseArgs(args, { boolean: true });
    const { _, ...flags } = parsed;
    const positional = _ as string[];

    const [head, tail, ...rest] = positional;
    const key = tail ? `${head}/${tail}` : head;

    const configText = await Deno.readTextFile(cliConfigPath);
    const config = JSON.parse(configText) as CLIConfig;

    const resolvedCliPath = resolve(cliConfigPath);
    const cliConfigDir = dirname(resolvedCliPath);

    const baseCommandDir = resolve(cliConfigDir, config.Commands ?? './commands');

    return {
      parsed,
      flags,
      positional,
      head,
      tail,
      rest,
      key,
      config,
      baseCommandDir,
    };
  }
}
