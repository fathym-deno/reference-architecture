import type { CLICommandEntry } from "./CLICommandEntry.ts";
import type { CLICommandResolver } from "./CLICommandResolver.ts";
import type { CLIConfig } from "./CLIConfig.ts";
import { CLIHelpBuilder } from "./CLIHelpBuilder.ts";
import type { CommandRuntime } from "./commands/CommandRuntime.ts";
import { HelpCommand, HelpCommandParams } from "./HelpCommand.ts";

export class CLICommandMatcher {
  constructor(protected resolver: CLICommandResolver) {}

  public async Resolve(
    config: CLIConfig,
    commandMap: Map<string, CLICommandEntry>,
    key: string | undefined,
    flags: Record<string, unknown>,
    positional: string[],
    baseTemplatesDir?: string,
  ): Promise<CommandRuntime | undefined> {
    let match: CLICommandEntry | undefined;
    let remainingArgs: string[] = [];

    const parts = [...positional];
    while (parts.length > 0) {
      const tryKey = parts.join("/");
      const entry = commandMap.get(tryKey);

      if (entry?.CommandPath || entry?.GroupPath) {
        match = entry;
        key = tryKey;
        remainingArgs = positional.slice(parts.length);
        break;
      }

      parts.pop();
    }

    if (!match && key) {
      const entry = commandMap.get(key);
      if (entry?.CommandPath || entry?.GroupPath) {
        match = entry;
        remainingArgs = positional.slice(1);
      }
    }

    const [cmdInst, groupInst] = match
      ? await Promise.all([
        match.CommandPath
          ? this.resolver.LoadCommandInstance(
            match.CommandPath,
            { ...flags, baseTemplatesDir },
            remainingArgs,
          )
          : undefined,
        match.GroupPath
          ? this.resolver.LoadCommandInstance(
            match.GroupPath,
            { ...flags, baseTemplatesDir },
            remainingArgs,
          )
          : undefined,
      ])
      : [undefined, undefined];

    const isGroupOnly = !cmdInst && groupInst;
    const isHelpRequested = flags.help === true;
    const shouldShowHelp = isHelpRequested || !key || isGroupOnly ||
      (!cmdInst && !groupInst);

    if (!shouldShowHelp && cmdInst) return cmdInst;

    const helpBuilder = new CLIHelpBuilder(this.resolver);
    const helpCtx = await helpBuilder.Build(
      config,
      commandMap,
      key,
      flags,
      cmdInst,
      groupInst,
    );

    return helpCtx
      ? new HelpCommand(new HelpCommandParams(helpCtx, []))
      : undefined;
  }
}
