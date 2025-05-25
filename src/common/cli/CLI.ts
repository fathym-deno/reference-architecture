import { dirname, parseArgs, relative, resolve, walk } from './.deps.ts';
import { DefaultHelp } from './DefaultHelp.ts';

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
  default: new (flags: Record<string, unknown>, args: string[]) => {
    Run(): Promise<void>;
  };
  Metadata?: {
    Name: string;
    Description?: string;
    Usage?: string;
    Examples?: string[];
  };
};

export interface Help {
  ShowRoot(config: CLIConfig, commands: Map<string | number, { Path: string }>): void;
  ShowCommand(key: string | number, metadata?: CommandModule['Metadata']): void;
  ShowUnknown(key: string | number, commands: Map<string | number, { Path: string }>): void;
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
    const commands = await this.loadCommands(commandsPath);

    const key = tail ? `${head}/${tail}` : head;

    // 🧾 Optional Debug
    const verbose = flags.verbose || Deno.env.get("DENO_DEBUG");
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

    const mod = await import(`file:///${match.Path}`);
    const Cmd = mod.default;

    if (!Cmd) {
      console.error(`❌ Command file ${match.Path} has no default export.`);
      Deno.exit(1);
    }

    if (flags.help) {
      this.Help.ShowCommand(key, mod.Metadata);
      Deno.exit(0);
    }

    const positionalArgs = tail ? rest : positional;

    console.log(`🚀 ${config.Name}: running "${key}"`);
    const instance = new Cmd(flags, positionalArgs);
    await instance.Run();
    console.log(`✅ ${config.Name}: "${key}" completed`);
  }

  private async loadCommands(baseDir: string) {
    const commands = new Map<string | number, { Path: string }>();

    for await (const entry of walk(baseDir, {
      includeDirs: false,
      exts: ['.ts'],
    })) {
      if (entry.name === '.metadata.ts') continue;

      const rel = relative(baseDir, entry.path).replace(/\.ts$/, '');
      const key = rel.replace(/\\/g, '/');
      const absPath = resolve(entry.path);
      commands.set(key, { Path: absPath });
    }

    return commands;
  }
}
