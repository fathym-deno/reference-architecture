import type { CLIInvocationParser } from "./CLIInvocationParser.ts";
import type { CLICommandResolver } from "./CLICommandResolver.ts";
import { DefaultCLIInvocationParser } from "./DefaultCLIInvocationParser.ts";
import { DefaultCLICommandResolver } from "./DefaultCLICommandResolver.ts";
import { CLIExecutor } from "./CLIExecutor.ts";
import { CLICommandMatcher } from "./CLICommandMatcher.ts";
import { IoCContainer } from "jsr:@fathym/ioc@0.0.14";

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
    const parsed = await this.parser.ParseInvocation(cliConfigPath, args);

    const commandMap = await this.resolver.ResolveCommandMap(
      parsed.baseCommandDir,
    );
    const ioc = new IoCContainer();

    await parsed.initFn?.(ioc, parsed.config);

    const matcher = new CLICommandMatcher(this.resolver);
    const { Command, Flags, Args, Params } = await matcher.Resolve(
      parsed.config,
      commandMap,
      parsed.key,
      parsed.flags,
      parsed.positional,
      parsed.baseTemplatesDir,
    );

    const executor = new CLIExecutor(ioc);
    await executor.Execute(parsed.config, Command, {
      key: parsed.key || "",
      flags: Flags,
      positional: Args,
      paramsCtor: Params,
    });
  }
}
