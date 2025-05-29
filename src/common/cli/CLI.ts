// CLI.ts
import { CLIInvocationParser } from './CLIInvocationParser.ts';
import { CLICommandResolver } from './CLICommandResolver.ts';
import { CLIHelp } from './CLIHelp.ts';
import { DefaultCLIHelp } from './DefaultCLIHelp.ts';
import { DefaultCLIInvocationParser } from './DefaultCLIInvocationParser.ts';
import { resolve, toFileUrl } from "./.deps.ts";
import { Command, CommandModuleMetadata } from "./.exports.ts";
import { CLIConfig } from "./CLIConfig.ts";
import { CLIResolvedEntry } from "./CLIResolvedEntry.ts";

export interface CLIOptions {
  help?: CLIHelp;
  resolver?: CLICommandResolver;
  parser?: CLIInvocationParser;
}

export class CLI {
  protected help: CLIHelp;
  protected resolver: CLICommandResolver;
  protected parser: CLIInvocationParser;

  /**
   * CLI constructor that uses options for dynamic configuration.
   * @param options - Configuration object for CLI setup.
   */
  constructor(options: CLIOptions = {}) {
    // Set defaults and override if provided in options
    this.help = options.help ?? new DefaultCLIHelp();
    this.resolver = options.resolver ?? new CLICommandResolver();
    this.parser = options.parser ?? new DefaultCLIInvocationParser();
  }

  /**
   * Runs the CLI based on the provided configuration file path and arguments.
   * @param cliConfigPath - Path to the CLI config file.
   * @param args - Command-line arguments passed to the CLI.
   */
  public async RunFromConfig(cliConfigPath: string, args: string[]) {
    const { flags, positional, head, tail, rest, key, baseCommandDir, config } =
      await this.parser.ParseInvocation(cliConfigPath, args);

    const commandMap = await this.resolver.ResolveCommandMap(baseCommandDir);

    if (!head) {
      await this.handleHelp(config, baseCommandDir, key, commandMap);
      Deno.exit(0);
    }

    const match = commandMap.get(key);
    if (!match) {
      this.help.ShowUnknown(key, commandMap);
      await this.help.ShowRoot(config, commandMap);
      Deno.exit(1);
    }

    try {
      const [command] = match;
      const { Path } = command ?? {}; // Use Path from resolved entry

      const instance = await this.resolver.LoadCommandInstance(
        Path,
        flags,
        tail ? rest : positional
      );

      if (flags.help) {
        this.help.ShowCommand(key, instance.BuildMetadata());
        Deno.exit(0);
      }

      console.log(`🚀 ${config.Name}: running "${key}"`);
      const result = await this.runCommandLifecycle(instance);
      if (typeof result === 'number') Deno.exit(result);

      console.log(`✅ ${config.Name}: "${key}" completed`);
    } catch (err) {
      console.error(`💥 Error during "${key}" execution:\n`, err);
      Deno.exit(1);
    }
  }

  /**
   * Runs the command lifecycle (Init, Run, Cleanup).
   * @param cmd - The command to execute.
   * @returns The result of the command execution.
   */
  protected async runCommandLifecycle(cmd: Command): Promise<void | number> {
    if (typeof cmd.Init === 'function') await cmd.Init();

    const result =
      typeof cmd.DryRun === 'function' && cmd.Params.DryRun
        ? await cmd.DryRun()
        : await cmd.Run();

    if (typeof cmd.Cleanup === 'function') await cmd.Cleanup();

    return result;
  }

  /**
   * Handles displaying help information based on the parsed command.
   */
  protected async handleHelp(
    config: CLIConfig,
    baseCommandDir: string,
    key: string,
    commandMap: Map<string, CLIResolvedEntry>
  ) {
    const groupKeys = [...commandMap.keys()].filter((k) =>
      k.startsWith(`${key}/`)
    );
    if (groupKeys.length > 0) {
      await this.showGroupHelp(config, baseCommandDir, key, groupKeys, commandMap);
    } else {
      await this.help.ShowRoot(config, commandMap);
    }
  }

  /**
   * Displays help information for the command group.
   */
  protected async showGroupHelp(
    config: CLIConfig,
    baseCommandDir: string,
    group: string,
    subcommands: string[],
    commandMap: Map<string, CLIResolvedEntry>
  ) {
    const scoped = new Map<string, CLIResolvedEntry>();

    for (const key of subcommands) {
      const sub = key.split('/')[1]; // Extract the subcommand from the group/command structure
      const resolvedEntry = commandMap.get(key);

      if (resolvedEntry) {
        scoped.set(sub, resolvedEntry); // Add the tuple (command, metadata) to scoped
      }
    }

    let metadata: CommandModuleMetadata | undefined;
    try {
      // Load metadata for the group (if available)
      const metaPath = resolve(baseCommandDir, group, '.metadata.ts');
      metadata = (await import(toFileUrl(metaPath).href)).Metadata;
    } catch {
      // optional: if metadata is missing, we skip it
    }

    // Show group help using the scoped commands and metadata
    await this.help.ShowGroup(group, config, scoped, metadata);
  }
}
