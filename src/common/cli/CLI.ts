import { IoCContainer } from "./.deps.ts";
import type { CLIConfig } from "./CLIConfig.ts";
import type { CLIOptions } from "./CLIOptions.ts";

import { CLIInvocationParser } from "./CLIInvocationParser.ts";
import { CLICommandResolver } from "./CLICommandResolver.ts";
import { CLICommandExecutor } from "./CLICommandExecutor.ts";
import { CLICommandMatcher } from "./CLICommandMatcher.ts";

export class CLI {
  protected resolver: CLICommandResolver;
  protected parser: CLIInvocationParser;

  constructor(
    options: CLIOptions = {},
    protected ioc: IoCContainer = new IoCContainer(),
  ) {
    this.resolver = options.resolver ?? new CLICommandResolver();
    this.parser = options.parser ?? new CLIInvocationParser();

    this.ioc.Register(CLICommandResolver, () => this.resolver);
    this.ioc.Register(CLIInvocationParser, () => this.parser);
  }

  async RunFromArgs(args: string[]): Promise<void> {
    const { config, resolvedPath, remainingArgs } = await this.resolver
      .ResolveConfig(args);

    return await this.RunWithConfig(config, remainingArgs, resolvedPath);
  }

  public async RunWithConfig(
    config: CLIConfig,
    args: string[],
    configPath: string,
  ): Promise<void> {
    const parsed = await this.parser.ParseInvocation(config, args, configPath);

    const commandMap = await this.resolver.ResolveCommandMap(
      parsed.baseCommandDir,
    );

    const initFn = parsed.initPath
      ? await this.resolver.ResolveInitFn(parsed.initPath)
      : undefined;

    await initFn?.(this.ioc, parsed.config);

    const matcher = new CLICommandMatcher(this.resolver);
    const { Command, Flags, Args, Params } = await matcher.Resolve(
      parsed.config,
      commandMap,
      parsed.key,
      parsed.flags,
      parsed.positional,
    );

    const executor = new CLICommandExecutor(this.ioc, this.resolver);

    await executor.Execute(parsed.config, Command, {
      key: parsed.key || "",
      flags: Flags,
      positional: Args,
      paramsCtor: Params,
      baseTemplatesDir: parsed.baseTemplatesDir,
    });
  }
}
