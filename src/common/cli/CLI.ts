import { findClosestMatch, toFileUrl } from './.deps.ts';
import { CLIInvocationParser } from './CLIInvocationParser.ts';
import { CLICommandResolver } from './CLICommandResolver.ts';
import { DefaultCLIInvocationParser } from './DefaultCLIInvocationParser.ts';
import { DefaultCLICommandResolver } from './DefaultCLICommandResolver.ts';
import { CLICommandEntry, Command, CommandModuleMetadata } from './.exports.ts';
import { CLIConfig } from './CLIConfig.ts';
import { CommandParams } from './commands/CommandParams.ts';
import { HelpContext } from './HelpContext.ts';
import { HelpCommand, HelpCommandParams } from './HelpCommand.ts';

export interface CLIOptions {
  resolver?: CLICommandResolver;
  parser?: CLIInvocationParser;
}

export class CLI {
  protected resolver: CLICommandResolver;
  protected parser: CLIInvocationParser;

  constructor(options: CLIOptions = {}) {
    this.resolver = options.resolver ?? new DefaultCLICommandResolver();
    this.parser = options.parser ?? new DefaultCLIInvocationParser();
  }

  public async RunFromConfig(cliConfigPath: string, args: string[]) {
    const { flags, positional, key, baseCommandDir, config } =
      await this.parser.ParseInvocation(cliConfigPath, args);

    const commandMap = await this.resolver.ResolveCommandMap(baseCommandDir);

    const command = await this.resolveCLICommand(
      config,
      commandMap,
      key,
      flags,
      positional
    );

    await this.executeCommand(config, command, key);
  }

  protected async resolveCLICommand(
    config: CLIConfig,
    commandMap: Map<string, CLICommandEntry>,
    key: string | undefined,
    flags: Record<string, unknown>,
    positional: string[]
  ): Promise<Command | undefined> {
    let match = key ? commandMap.get(key) : undefined;

    if (!match && key) {
      const deeperKey = [...commandMap.keys()]
        .filter(
          (k) => k.startsWith(`${key}/`) && commandMap.get(k)?.CommandPath
        )
        .sort((a, b) => b.length - a.length)[0];

      if (deeperKey) {
        match = commandMap.get(deeperKey);
        key = deeperKey;
      }
    }

    const [cmdInst, groupInst] = match
      ? await Promise.all([
          match.CommandPath
            ? this.resolver.LoadCommandInstance(
                match.CommandPath,
                flags,
                positional
              )
            : undefined,
          match.GroupPath
            ? this.resolver.LoadCommandInstance(
                match.GroupPath,
                flags,
                positional
              )
            : undefined,
        ])
      : [undefined, undefined];

    const isGroupOnly = !cmdInst && groupInst;
    const isHelpRequested = flags.help === true;

    // 🛠️ FINAL CONDITIONAL — help should show if:
    // - No key
    // - Help was explicitly requested
    // - The key resolves only to a group (not a command)
    const shouldShowHelp =
      isHelpRequested || !key || isGroupOnly || (!cmdInst && !groupInst);

    // ✅ If we’re NOT in a help case and have a runnable command, execute it.
    if (!shouldShowHelp && cmdInst) {
      return cmdInst;
    }

    const helpCtx = await this.buildHelpContextIfNeeded(
      config,
      commandMap,
      key,
      flags,
      cmdInst,
      groupInst
    );

    return helpCtx
      ? new HelpCommand(new HelpCommandParams(helpCtx, []))
      : undefined;
  }

  protected async buildHelpContextIfNeeded(
    config: CLIConfig,
    commandMap: Map<string, CLICommandEntry>,
    key: string | undefined,
    flags: Record<string, unknown>,
    cmdInst?: Command,
    groupInst?: Command
  ): Promise<HelpContext | undefined> {
    const sections: HelpContext['Sections'] = [];

    const formatItem = (
      item: CommandModuleMetadata & { Token: string },
      baseKey: string
    ): CommandModuleMetadata => {
      const { Token, Name, Description, ...rest } = item;

      // Remove redundant prefix from token
      const tokenParts = Token.split('/');
      const baseParts = baseKey ? baseKey.split('/') : [];
      const trimmed = tokenParts.slice(baseParts.length).join(' ');

      return {
        Name: `${trimmed} - ${Name}`,
        Description,
        ...rest,
      };
    };

    if (key) {
      if (groupInst) {
        const grpMd = groupInst.BuildMetadata();

        sections.push({
          type: 'GroupDetails',
          ...grpMd,
          Name: `Group: ${grpMd.Name}`,
        });
      }

      if (cmdInst) {
        const cmdMd = cmdInst.BuildMetadata();

        sections.push({
          type: 'CommandDetails',
          ...cmdMd,
          Name: `Command: ${cmdMd.Name}`,
        });
      }

      if (groupInst) {
        const childCmds = await this.getChildItems(commandMap, key, false);
        if (childCmds.length) {
          sections.push({
            type: 'CommandList',
            title: 'Available Commands',
            items: childCmds.map((item) => formatItem(item, key)),
          });
        }

        const childGrps = await this.getChildItems(commandMap, key, true);
        if (childGrps.length) {
          sections.push({
            type: 'GroupList',
            title: 'Available Groups',
            items: childGrps.map((item) => formatItem(item, key)),
          });
        }
      }

      if (!cmdInst && !groupInst) {
        const guess = findClosestMatch(key, [...commandMap.keys()]);
        sections.push({
          type: 'Error',
          message: `Unknown command: ${key}`,
          suggestion: guess,
          Name: key,
        });

        const root = this.buildRootIntro(config);
        if (root) {
          sections.unshift({ type: 'CommandDetails', ...root });
        }
      }
    } else {
      const root = this.buildRootIntro(config);
      if (root) {
        sections.push({ type: 'CommandDetails', ...root });
      }

      const rootCmds = await this.getChildItems(commandMap, '', false);
      if (rootCmds.length) {
        sections.push({
          type: 'CommandList',
          title: 'Available Commands',
          items: rootCmds.map((item) => formatItem(item, '')),
        });
      }

      const rootGrps = await this.getChildItems(commandMap, '', true);
      if (rootGrps.length) {
        sections.push({
          type: 'GroupList',
          title: 'Available Groups',
          items: rootGrps.map((item) => formatItem(item, '')),
        });
      }
    }

    return sections.length > 0 ? { Sections: sections } : undefined;
  }

  protected async getChildItems(
    commandMap: Map<string, CLICommandEntry>,
    key: string,
    groupsOnly: boolean
  ): Promise<(CommandModuleMetadata & { Token: string })[]> {
    const baseDepth = key === '' ? 0 : key.split('/').length;

    const matches = [...commandMap.entries()].filter(([k, v]) => {
      const depth = k.split('/').length;
      const isDirectChild =
        (key === '' && depth === 1) ||
        (k.startsWith(`${key}/`) && depth === baseDepth + 1);

      const isTypeMatch = groupsOnly ? !!v.GroupPath : !!v.CommandPath;
      return isDirectChild && isTypeMatch;
    });

    const results: (CommandModuleMetadata & { Token: string })[] = [];

    for (const [commandKey, entry] of matches) {
      const path = groupsOnly ? entry.GroupPath : entry.CommandPath;
      if (!path) continue;

      try {
        const inst = await this.resolver.LoadCommandInstance(path, {}, []);
        const meta = inst?.BuildMetadata?.();

        if (meta?.Name) {
          results.push({
            ...meta,
            Token: commandKey,
          });
        }
      } catch {
        console.warn(`⚠️ Skipped metadata load from ${path}`);
      }
    }

    return results;
  }

  protected buildRootIntro(config: CLIConfig): CommandModuleMetadata {
    const token =
      config.Tokens?.[0] ?? config.Name.toLowerCase().replace(/\s+/g, '-');

    return {
      Name: `${config.Name} CLI v${config.Version}`,
      Description: config.Description,
      Usage: `${token} <command> [options]`,
      Examples: [`${token} dev`, `${token} scaffold/cloud --help`],
    };
  }

  protected async executeCommand(
    config: CLIConfig,
    command: Command<CommandParams> | undefined,
    key: string | undefined
  ) {
    if (!command) return;

    const isHelp = command instanceof HelpCommand;

    try {
      if (!isHelp) {
        console.log(`🚀 ${config.Name}: running "${key}"`);
      }

      const result = await this.runCommandLifecycle(command);

      if (typeof result === 'number') {
        Deno.exit(result);
      }

      if (!isHelp) {
        console.log(`✅ ${config.Name}: "${key}" completed`);
      }
    } catch (err) {
      console.error(`💥 Error during "${key}" execution:\n`, err);
      Deno.exit(1);
    }
  }

  protected async runCommandLifecycle(cmd: Command): Promise<void | number> {
    if (typeof cmd.Init === 'function') await cmd.Init();

    const result =
      typeof cmd.DryRun === 'function' && cmd.Params.DryRun
        ? await cmd.DryRun()
        : await cmd.Run();

    if (typeof cmd.Cleanup === 'function') await cmd.Cleanup();

    return result;
  }
}
