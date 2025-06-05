import { dirname, exists, join, parseArgs, resolve } from "./.deps.ts";
import type { CLIParsedResult } from "./types/CLIParsedResult.ts";
import type { CLIConfig } from "./types/CLIConfig.ts";

export class CLICommandInvocationParser {
  public async ParseInvocation(
    config: CLIConfig,
    args: string[],
    configPath: string,
  ): Promise<CLIParsedResult> {
    const cliConfigDir = dirname(resolve(configPath));

    const parsed = parseArgs(args, { boolean: true });
    const { _, ...flags } = parsed;
    const positional = _.map(String);

    const key = positional.filter((p) => !p.startsWith("-")).join("/");

    const baseCommandDir = resolve(
      cliConfigDir,
      config.Commands ?? "./commands",
    );
    const baseTemplatesDir = resolve(
      cliConfigDir,
      config.Templates ?? "./.templates",
    );

    const initPath = join(cliConfigDir, ".cli.init.ts");
    const hasInit = await exists(initPath);

    return {
      parsed,
      flags,
      positional,
      key,
      config,
      baseCommandDir,
      baseTemplatesDir,
      initPath: hasInit ? initPath : undefined,
    };
  }
}
