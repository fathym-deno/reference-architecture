// deno-lint-ignore-file no-explicit-any
import { dirname, fromFileUrl, IoCContainer, join, resolve } from "../.deps.ts";

import {
  captureLogs,
  CLICommandExecutor,
  CLICommandResolver,
  type CLIConfig,
} from "../.exports.ts";

import type { CommandRuntime } from "../commands/CommandRuntime.ts";
import type { CommandModule } from "../commands/CommandModule.ts";
import type { CommandParams } from "../commands/CommandParams.ts";
import { CLIInvocationParser } from "../CLIInvocationParser.ts";

export class CommandIntentRuntime<
  A extends unknown[],
  F extends Record<string, unknown>,
  P extends CommandParams<A, F>,
> {
  protected expectedLogs: string[] = [];
  protected expectedExitCode: number | null = null;
  protected capturedOutput = "";
  protected actualExitCode: number | null = null;

  protected runtime: CommandRuntime<P>;
  protected ioc: IoCContainer;

  public get Output(): string {
    return this.capturedOutput;
  }

  public get Logs(): string[] {
    return this.capturedOutput.split("\n").filter(Boolean);
  }

  public get ExitCode(): number | null {
    return this.actualExitCode;
  }

  constructor(
    protected testName: string,
    protected module: CommandModule<A, F, P>,
    protected args: A,
    protected flags: F,
    protected commandFileUrl: string,
  ) {
    this.ioc = new IoCContainer();
    this.runtime = new module.Command();
  }

  public ExpectLog(msg: string): this {
    this.expectedLogs.push(msg);
    return this;
  }

  public ExpectLogs(...msgs: string[]): this {
    msgs.forEach((msg) => this.ExpectLog(msg));
    return this;
  }

  public ExpectExit(code: number): this {
    this.expectedExitCode = code;
    return this;
  }

  public Run(): void {
    Deno.test(this.testName, async () => {
      const originalExit = Deno.exit;
      let interceptedExitCode: number | null = null;

      // Intercept Deno.exit during test
      (Deno as any).exit = (code: number) => {
        interceptedExitCode = code ?? 0;

        if (code > 0) {
          throw new Error(`Deno.exit(${code}) intercepted`);
        }
      };

      try {
        const baseTemplatesDir = await resolveBaseTemplatesDir(
          this.commandFileUrl,
        );

        this.ioc.Register(CLICommandResolver, () => new CLICommandResolver());
        this.ioc.Register(CLIInvocationParser, () => new CLIInvocationParser());

        const config: CLIConfig = {
          Name: "TestCLI",
          Version: "0.0.0",
          Description: "CLI under test",
          Tokens: ["test-cli"],
        };

        const executor = new CLICommandExecutor(
          this.ioc,
          await this.ioc.Resolve(CLICommandResolver),
        );

        this.capturedOutput = await captureLogs(async () => {
          await executor.Execute(config, this.runtime, {
            key: "test-command",
            flags: this.flags,
            positional: this.args as string[],
            paramsCtor: this.module.Params,
            baseTemplatesDir,
            commands: undefined,
          });
        }, true);
      } catch (err) {
        if (
          interceptedExitCode === null &&
          err instanceof Error &&
          /Deno\.exit\(\d+\)/.test(err.message)
        ) {
          const match = err.message.match(/\d+/);
          if (match) interceptedExitCode = parseInt(match[0], 10);
        } else if (!/Deno\.exit/.test((err as any).message)) {
          throw err;
        }
      } finally {
        (Deno as any).exit = originalExit;
      }

      if (
        this.expectedExitCode !== null &&
        interceptedExitCode !== this.expectedExitCode
      ) {
        throw new Error(
          `Expected exit code ${this.expectedExitCode}, got ${interceptedExitCode}`,
        );
      }

      for (const expected of this.expectedLogs) {
        if (!this.capturedOutput.includes(expected)) {
          throw new Error(
            `Expected log "${expected}" not found in output:\n${this.capturedOutput}`,
          );
        }
      }
    });
  }
}

export async function findProjectRoot(startPath: string): Promise<string> {
  let dir = dirname(startPath);

  while (true) {
    const cliConfigPath = join(dir, ".cli.json");

    try {
      const stat = await Deno.stat(cliConfigPath);
      if (stat.isFile) return dir;
    } catch {
      // Ignore and continue upward
    }

    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(`Could not find .cli.json in any parent of ${startPath}`);
    }

    dir = parent;
  }
}

export async function resolveBaseTemplatesDir(
  commandFileUrl: string,
): Promise<string> {
  const commandFilePath = fromFileUrl(commandFileUrl);
  const projectRoot = await findProjectRoot(commandFilePath);
  return resolve(projectRoot, ".templates");
}
