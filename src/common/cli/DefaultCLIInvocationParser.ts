import {
  dirname,
  exists,
  join,
  parseArgs,
  resolve,
  toFileUrl,
} from './.deps.ts';
import type {
  CLIInvocationParser,
  CLIParsedResult,
} from './CLIInvocationParser.ts';
import type { CLIConfig } from './CLIConfig.ts';
import type { CLIInitFn } from './CLIInitFn.ts';

export class DefaultCLIInvocationParser implements CLIInvocationParser {
  public async ParseInvocation(
    cliConfigPath: string,
    args: string[]
  ): Promise<CLIParsedResult> {
    let configPath = cliConfigPath;
    let updatedArgs = args ?? [];
    let configText: string | undefined;

    // If no args, treat it as if the CLI was called bare (e.g. `deno run cli-runtime.ts`)
    if (updatedArgs.length === 0) {
      const fallbackPath = join(Deno.cwd(), '.cli.json');

      if (await exists(fallbackPath)) {
        configPath = fallbackPath;
        updatedArgs = []; // explicitly empty
      } else {
        throw new Error(
          `No CLI arguments or config provided, and no .cli.json found in current directory.`
        );
      }
    }

    try {
      configText = await Deno.readTextFile(configPath);
    } catch {
      const fallbackPath = join(Deno.cwd(), '.cli.json');

      if (await exists(fallbackPath)) {
        updatedArgs = [cliConfigPath, ...args];
        configPath = fallbackPath;
        configText = await Deno.readTextFile(configPath);
      } else {
        throw new Error(
          `Unable to load CLI config from '${cliConfigPath}', and no .cli.json found in current directory.`
        );
      }
    }

    const config = JSON.parse(configText) as CLIConfig;

    const parsed = parseArgs(updatedArgs, { boolean: true });
    const { _, ...flags } = parsed;
    const positional = _.map(String);

    const keyParts = positional.filter((p) => !p.startsWith('-'));
    const key = keyParts.join('/');

    const resolvedCliPath = resolve(configPath);
    const cliConfigDir = dirname(resolvedCliPath);

    const baseCommandDir = resolve(
      cliConfigDir,
      config.Commands ?? './commands'
    );

    const baseTemplatesDir = resolve(
      cliConfigDir,
      config.Templates ?? './.templates'
    );

    const initFilePath = join(cliConfigDir, '.cli.init.ts');
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
    initFilePath?: string
  ): Promise<CLIInitFn | undefined> {
    if (initFilePath && (await exists(initFilePath))) {
      const mod = (await import(toFileUrl(initFilePath).href)).default;

      return mod as CLIInitFn;
    }
  }
}
