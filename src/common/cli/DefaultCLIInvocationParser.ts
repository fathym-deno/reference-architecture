import {
  dirname,
  exists,
  join,
  parseArgs,
  resolve,
  toFileUrl,
} from "./.deps.ts";
import type {
  CLIInvocationParser,
  CLIParsedResult,
} from "./CLIInvocationParser.ts";
import type { CLIConfig } from "./CLIConfig.ts";
import type { CLIInitFn } from "./CLIInitFn.ts";

export class DefaultCLIInvocationParser implements CLIInvocationParser {
  public async ParseInvocation(
    cliConfigPath: string,
    args: string[],
  ): Promise<CLIParsedResult> {
    let configPath = cliConfigPath;
    let updatedArgs = args ?? [];
    let configText: string | undefined;

    const firstArgIsFile = updatedArgs.length > 0 &&
      updatedArgs[0].endsWith(".json");

    // 👇 Check if the first arg is a real file
    if (firstArgIsFile && (await exists(updatedArgs[0]))) {
      configPath = updatedArgs[0];
      updatedArgs = updatedArgs.slice(1);
    } else {
      try {
        if (configPath) {
          configText = await Deno.readTextFile(configPath);
        }
      } catch {
        // We'll fall back below if the primary config failed to load
      }

      if (!configText) {
        const fallbackPath = join(Deno.cwd(), ".cli.json");

        if (await exists(fallbackPath)) {
          updatedArgs = configPath ? [configPath, ...args] : [...args];
          configPath = fallbackPath;
          configText = await Deno.readTextFile(configPath);
        } else {
          console.error(
            `❌ Unable to load CLI config.\n` +
              `🧐 Tried path: '${cliConfigPath ?? "undefined"}'\n` +
              `📁 No '.cli.json' found in current directory.\n\n` +
              `👉 You can:\n` +
              `   - Create a .cli.json file\n` +
              `   - Or pass the path explicitly: deno run -A cli-runtime.ts ./path/to/.cli.json\n`,
          );
          Deno.exit(1);
        }
      }
    }

    if (!configText && configPath) {
      configText = await Deno.readTextFile(configPath);
    }

    const config = JSON.parse(configText!) as CLIConfig;

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

    const initFilePath = join(cliConfigDir, ".cli.init.ts");
    const hasInit = await exists(initFilePath);

    return {
      parsed,
      flags,
      positional,
      key,
      config,
      baseCommandDir,
      baseTemplatesDir,
      initFn: hasInit ? await this.loadInitHook(initFilePath) : undefined,
    };
  }

  protected async loadInitHook(
    initFilePath?: string,
  ): Promise<CLIInitFn | undefined> {
    if (initFilePath && (await exists(initFilePath))) {
      const mod = (await import(toFileUrl(initFilePath).href)).default;
      return mod as CLIInitFn;
    }
  }
}
