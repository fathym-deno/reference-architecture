import type { CLIConfig } from './CLIConfig.ts';
import type { CLIParsedResult } from './CLIParsedResult.ts';
import type { CLIOptions } from './CLIOptions.ts';

import { CLIInvocationParser } from './CLIInvocationParser.ts';
import { CLICommandResolver } from './CLICommandResolver.ts';
import { CLIExecutor } from './CLIExecutor.ts';
import { CLICommandMatcher } from './CLICommandMatcher.ts';
import { IoCContainer } from 'jsr:@fathym/ioc@0.0.14';

export class CLI {
  protected resolver: CLICommandResolver;
  protected parser: CLIInvocationParser;

  constructor(options: CLIOptions = {}) {
    this.resolver = options.resolver ?? new CLICommandResolver();
    this.parser = options.parser ?? new CLIInvocationParser();
  }

  public async RunFromConfig(cliConfigPath: string, args: string[]) {
    const { config, resolvedPath } = await this.resolver.ResolveConfig(
      cliConfigPath
    );
    return await this.RunWithConfig(config, args, resolvedPath);
  }

  public async RunWithConfig(
    config: CLIConfig,
    args: string[],
    configPath: string
  ) {
    const parsed = await this.parser.ParseInvocation(config, args, configPath);

    const commandMap = await this.resolver.ResolveCommandMap(
      parsed.baseCommandDir
    );

    const ioc = new IoCContainer();

    const initFn = parsed.initPath
      ? await this.resolver.ResolveInitFn(parsed.initPath)
      : undefined;

    await initFn?.(ioc, parsed.config);

    const matcher = new CLICommandMatcher(this.resolver);
    const { Command, Flags, Args, Params, Templates } = await matcher.Resolve(
      parsed.config,
      commandMap,
      parsed.key,
      parsed.flags,
      parsed.positional,
      parsed.baseTemplatesDir
    );

    ioc.Register(() => Templates, {
      Type: ioc.Symbol('TemplateLocator'),
    });

    const executor = new CLIExecutor(ioc);

    await executor.Execute(parsed.config, Command, {
      key: parsed.key || '',
      flags: Flags,
      positional: Args,
      paramsCtor: Params,
      templates: Templates,
    });
  }
}
