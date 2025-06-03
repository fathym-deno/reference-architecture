import type { CLIInvocationParser } from "./CLIInvocationParser.ts";
import type { CLICommandResolver } from "./CLICommandResolver.ts";
import { DefaultCLIInvocationParser } from "./DefaultCLIInvocationParser.ts";
import { DefaultCLICommandResolver } from "./DefaultCLICommandResolver.ts";
import { CLIExecutor } from "./CLIExecutor.ts";
import { CLICommandMatcher } from "./CLICommandMatcher.ts";
import { IoCContainer } from "jsr:@fathym/ioc@0.0.14";
import type { CLIInitFn } from "./CLIInitFn.ts";
import { exists, toFileUrl } from "./.deps.ts";

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

    const initFn = await this.loadInitHook(parsed.initFilePath);
    if (initFn) {
      await initFn(ioc, parsed.config);
    }

    const matcher = new CLICommandMatcher(this.resolver);
    const command = await matcher.Resolve(
      parsed.config,
      commandMap,
      parsed.key,
      parsed.flags,
      parsed.positional,
      parsed.baseTemplatesDir,
    );

    const executor = new CLIExecutor(ioc);
    await executor.Execute(parsed.config, command, {
      key: parsed.key || "",
    });
  }

  protected async loadInitHook(
    initFilePath?: string,
  ): Promise<CLIInitFn | undefined> {
    if (initFilePath && (await exists(initFilePath))) {
      const mod = (await import(toFileUrl(initFilePath).href)).default;

      return mod as CLIInitFn;
    }
  }
}
