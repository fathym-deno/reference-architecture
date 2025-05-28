import {
  dirname,
  parseArgs,
  relative,
  resolve,
  toFileUrl,
  walk,
} from './.deps.ts';

import type { CLIConfig } from './CLIConfig.ts';
import type { CLIHelp } from './CLIHelp.ts';
import { DefaultCLIHelp } from './DefaultCLIHelp.ts';
import type { Command } from './commands/Command.ts';
import type { CommandModule } from './commands/CommandModule.ts';
import { CommandParams } from './commands/CommandParams.ts';

/**
 * The main CLI runner.
 * Loads config, resolves commands, and executes CLI requests.
 */
export class CLI {
  constructor(protected Help: CLIHelp = new DefaultCLIHelp()) {}

  public async RunFromConfig(cliConfigPath: string, args: string[]) {
    const configText = await Deno.readTextFile(cliConfigPath);
    const config = JSON.parse(configText) as CLIConfig;

    const parsed = parseArgs(args, { boolean: true });
    const positional = parsed._ as string[];
    const { _, ...flags } = parsed;

    const [head, tail, ...rest] = positional;
    const resolvedCliPath = resolve(cliConfigPath);
    const cliConfigDir = dirname(resolvedCliPath);
    const commandsPath = resolve(cliConfigDir, config.Commands ?? './commands');

    const commandMap = await this.resolveCommandMap(commandsPath);
    const key = tail ? `${head}/${tail}` : head;

    const verbose = flags.verbose || Deno.env.get('DENO_DEBUG');
    if (verbose) {
      console.debug(`📦 CLI Invocation`);
      console.debug(`    Positional:`, positional);
      console.debug(`    Flags:`, flags);
      console.debug(`    Command Key: ${key}`);
    }

    if (!head || flags.help) {
      await this.Help.ShowRoot(config, commandMap);
      Deno.exit(0);
    }

    const match = commandMap.get(key);
    if (!match) {
      this.Help.ShowUnknown(key, commandMap);
      await this.Help.ShowRoot(config, commandMap);
      Deno.exit(1);
    }

    const { Path } = match;

    try {
      const mod: CommandModule = (await import(toFileUrl(Path).href)).default;
      const Cmd = mod.Command;
      const CmdParams = mod.Params;

      if (!Cmd || typeof Cmd !== 'function') {
        throw new Error(`Command at ${Path} is invalid or missing Command export.`);
      }

      const resolvedArgs = tail ? rest : positional;
      const params = CmdParams
        ? new CmdParams(flags, resolvedArgs)
        : new (class extends CommandParams<Record<string, unknown>, unknown[]> {
            constructor() {
              super(flags, resolvedArgs);
            }
          })();

      const instance: Command = new Cmd(params);

      if (flags.help) {
        this.Help.ShowCommand(key, instance.BuildMetadata());
        Deno.exit(0);
      }

      console.log(`🚀 ${config.Name}: running "${key}"`);

      if (typeof instance.Init === 'function') {
        await instance.Init();
      }

      const result = typeof instance.DryRun === 'function' && instance.Params.DryRun
        ? await instance.DryRun()
        : await instance.Run();

      if (typeof instance.Cleanup === 'function') {
        await instance.Cleanup();
      }

      if (typeof result === 'number') {
        Deno.exit(result);
      }
    } catch (err) {
      console.error(`💥 Error during "${key}" execution:\n`, err);
      Deno.exit(1);
    }

    console.log(`✅ ${config.Name}: "${key}" completed`);
  }

  /**
   * Scans the command directory and maps CLI keys to command module paths.
   */
  protected async resolveCommandMap(baseDir: string) {
    const map = new Map<string | number, { Path: string }>();

    for await (const entry of walk(baseDir, {
      includeDirs: false,
      exts: ['.ts'],
    })) {
      if (entry.name === '.metadata.ts') continue;

      const rel = relative(baseDir, entry.path)
        .replace(/\\/g, '/')
        .replace(/\/index$/, '');
      const key = rel.replace(/\.ts$/, '');
      const absPath = resolve(entry.path);

      if (map.has(key)) {
        console.warn(`⚠️ Duplicate command key detected: "${key}"`);
        continue;
      }

      map.set(key, { Path: absPath });
    }

    return map;
  }
}
