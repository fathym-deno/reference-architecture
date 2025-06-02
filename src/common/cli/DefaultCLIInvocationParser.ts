import { dirname, exists, join, parseArgs, resolve } from "./.deps.ts";
import type {
  CLIInvocationParser,
  CLIParsedResult,
} from "./CLIInvocationParser.ts";
import type { CLIConfig } from "./CLIConfig.ts";

export class DefaultCLIInvocationParser implements CLIInvocationParser {
  public async ParseInvocation(
    cliConfigPath: string,
    args: string[],
  ): Promise<CLIParsedResult> {
    let configPath = cliConfigPath;
    let updatedArgs = args;
    let configText: string | undefined;

    try {
      configText = await Deno.readTextFile(configPath);
    } catch {
      const cwd = Deno.cwd();
      const fallbackPath = join(cwd, ".cli.json");

      if (await exists(fallbackPath)) {
        updatedArgs = [cliConfigPath, ...args];
        configPath = fallbackPath;
        configText = await Deno.readTextFile(configPath);
      } else {
        throw new Error(
          `Unable to load CLI config from '${cliConfigPath}', and no .cli.json found in current directory.`,
        );
      }
    }

    const config = JSON.parse(configText) as CLIConfig;

    const parsed = parseArgs(updatedArgs, { boolean: true });
    const { _, ...flags } = parsed;
    const positional = _.map(String);

    const keyParts = positional.filter((p) => !p.startsWith("-"));
    const key = keyParts.join("/");

    const resolvedCliPath = resolve(configPath);
    const cliConfigDir = dirname(resolvedCliPath);

    const baseCommandDir = resolve(
      cliConfigDir,
      config.Commands ?? "./commands",
    );

    const baseTemplatesDir = resolve(
      cliConfigDir,
      config.Templates ?? "./.templates",
    );

    return {
      parsed,
      flags,
      positional,
      key,
      config,
      baseCommandDir,
      baseTemplatesDir,
    };
  }
}
