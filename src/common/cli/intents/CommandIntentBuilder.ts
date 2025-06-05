// deno-lint-ignore-file no-explicit-any
import type { CommandModule } from '../commands/CommandModule.ts';
import type { CommandParams } from '../commands/CommandParams.ts';
import type { CommandContext } from '../commands/CommandContext.ts';
import { CommandIntentRuntime } from './CommandIntentRuntime.ts';
import { IoCContainer } from '../.deps.ts';
import { CLIConfig } from '../CLIConfig.ts';
import { CLIInitFn } from '../CLIInitFn.ts';

export function createTestContext<
  A extends unknown[],
  F extends Record<string, unknown>,
  P extends CommandParams<A, F>
>(
  cmd: CommandModule<A, F, P>,
  args: A,
  flags: F
): Promise<CommandContext<P, Record<string, unknown>, Record<string, any>>> {
  const ctor = cmd.Params!;
  const params = new ctor(args, flags);

  const log = {
    Info: console.log,
    Warn: console.warn,
    Error: console.error,
    Success: (...args: unknown[]) => console.log('✅', ...args),
  };

  return Promise.resolve({
    Key: '',
    ArgsSchema: cmd.ArgsSchema,
    FlagsSchema: cmd.FlagsSchema,
    Params: params,
    Config: {} as any,
    Log: log,
    Services: {} as any,
    Commands: {} as any,
  });
}

export class CommandIntentBuilder<
  A extends unknown[],
  F extends Record<string, unknown>,
  P extends CommandParams<A, F>
> {
  protected args: A = [] as unknown as A;
  protected flags: F = {} as F;
  protected initFn?: CLIInitFn;

  protected expectations: ((runner: CommandIntentRuntime<A, F, P>) => void)[] =
    [];

  constructor(
    protected command: CommandModule<A, F, P>,
    protected testName: string,
    protected commandFileUrl: string
  ) {}

  public Args(args: A): this {
    this.args = args;
    return this;
  }

  public Flags(flags: F): this {
    this.flags = flags;
    return this;
  }

  public WithInit(init: CLIInitFn): this {
    this.initFn = init;
    return this;
  }

  public ExpectLogs(...lines: string[]): this {
    lines.forEach((line) => {
      this.expectations.push((r) => r.ExpectLog(line));
    });
    return this;
  }

  public ExpectExit(code: number): this {
    this.expectations.push((r) => r.ExpectExit(code));
    return this;
  }

  public Run(): void {
    const runner = new CommandIntentRuntime(
      this.testName,
      this.command,
      this.args,
      this.flags,
      this.commandFileUrl,
      this.initFn
    );

    this.expectations.forEach((fn) => fn(runner));

    runner.Run();
  }
}
