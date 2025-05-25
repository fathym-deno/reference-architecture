import {
  dirname,
  parseArgs,
  relative,
  resolve,
  toFileUrl,
  walk,
} from './.deps.ts';
import { DefaultHelp } from './DefaultHelp.ts';

export interface Command {
  Run(): Promise<void | number>;
}

export type CLIConfig = {
  Name: string;
  Version: string;
  Description?: string;
  Commands: string;
  Help?: {
    Usage?: string;
    Examples?: string[];
  };
};

export type CommandModule = {
  default: new (params: CommandParams<any, any>) => Command;
  CmdParams?: new (
    flags: Record<string, unknown>,
    args: unknown[]
  ) => CommandParams<any, any>;
  Metadata?: {
    Name: string;
    Description?: string;
    Usage?: string;
    Examples?: string[];
  };
};

export abstract class CommandParams<
  F extends Record<string, unknown> = {},
  A extends unknown[] = []
> {
  constructor(public readonly Flags: F, public readonly Args: A) {}

  protected Arg<Index extends keyof A & number>(
    Index: Index
  ): A[Index] | undefined {
    return this.Args?.[Index];
  }

  protected Flag<K extends keyof F>(Key: K): F[K] | undefined {
    return this.Flags?.[Key];
  }
}

export interface Help {
  ShowRoot(
    config: CLIConfig,
    commands: Map<string | number, { Path: string }>
  ): void;
  ShowCommand(key: string | number, metadata?: CommandModule['Metadata']): void;
  ShowUnknown(
    key: string | number,
    commands: Map<string | number, { Path: string }>
  ): void;
}

export class CLI {
  constructor(protected Help: Help = new DefaultHelp()) {}

  public async RunFromConfig(cliConfigPath: string, args: string[]) {
    const configText = await Deno.readTextFile(cliConfigPath);
    const config = JSON.parse(configText) as CLIConfig;

    const parsed = parseArgs(args, { boolean: true });
    const { _, ...flags } = parsed;
    const positional = _;

    const [head, tail, ...rest] = positional;
    const resolvedCliPath = resolve(cliConfigPath);
    const cliConfigDir = dirname(resolvedCliPath);
    const commandsPath = resolve(cliConfigDir, config.Commands ?? './commands');
    const commands = await this.LoadCommands(commandsPath);

    const key = tail ? `${head}/${tail}` : head;

    const verbose = flags.verbose || Deno.env.get('DENO_DEBUG');
    if (verbose) {
      console.debug(`📦 CLI Invocation`);
      console.debug(`    Positional:`, positional);
      console.debug(`    Flags:`, flags);
      console.debug(`    Command Key: ${key}`);
    }

    if (!head || flags.help) {
      this.Help.ShowRoot(config, commands);
      Deno.exit(0);
    }

    const match = commands.get(key);

    if (!match) {
      console.error(`❌ Unknown command: ${key}`);
      this.Help.ShowUnknown(key, commands);
      this.Help.ShowRoot(config, commands);
      Deno.exit(1);
    }

    let mod: CommandModule;

    try {
      mod = await import(toFileUrl(match.Path).href);
    } catch (err) {
      console.error(`❌ Failed to import command: ${match.Path}`);
      console.error(err);
      Deno.exit(1);
    }

    const Cmd = mod.default;
    const CmdParams = mod.CmdParams;

    if (!Cmd || typeof Cmd !== 'function') {
      console.error(
        `❌ Command module at ${match.Path} must export a default class.`
      );
      Deno.exit(1);
    }

    if (flags.help) {
      this.Help.ShowCommand(key, mod.Metadata);
      Deno.exit(0);
    }

    const positionalArgs = tail ? rest : positional;

    const params = CmdParams
      ? new CmdParams(flags, positionalArgs)
      : new (class extends CommandParams<Record<string, unknown>, unknown[]> {
          constructor() {
            super(flags, positionalArgs);
          }
        })();

    const instance: Command = new Cmd(params);

    console.log(`🚀 ${config.Name}: running "${key}"`);

    try {
      const result = await instance.Run();
      if (typeof result === 'number') Deno.exit(result);
    } catch (err) {
      console.error(`💥 Error during "${key}" execution:\n`, err);
      Deno.exit(1);
    }

    console.log(`✅ ${config.Name}: "${key}" completed`);
  }

  private async LoadCommands(baseDir: string) {
    const commands = new Map<string | number, { Path: string }>();

    for await (const entry of walk(baseDir, {
      includeDirs: false,
      exts: ['.ts'],
    })) {
      if (entry.name === '.metadata.ts') continue;

      const rel = relative(baseDir, entry.path)
        .replace(/\\/g, '/')
        .replace(/\/index$/, ''); // Allow folders with index.ts

      const key = rel.replace(/\.ts$/, '');
      const absPath = resolve(entry.path);

      if (commands.has(key)) {
        console.warn(`⚠️ Duplicate command key detected: "${key}"`);
      }

      commands.set(key, { Path: absPath });
    }

    return commands;
  }
}
