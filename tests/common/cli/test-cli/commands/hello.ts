import {
  type CommandContext,
  CommandParams,
  CommandRuntime,
  defineCommandModule,
} from "@fathym/common/cli";
import { z } from "@fathym/common/third-party/zod";
import type { IoCContainer } from "../../../../../src/common/cli/.deps.ts";
import type { SayHello } from "../.cli.init.ts";

export const HelloFlagsSchema = z.object({
  loud: z.boolean().optional().describe("Shout the greeting"),
  "dry-run": z
    .boolean()
    .optional()
    .describe("Show the message without printing"),
});

export const HelloArgsSchema = z.tuple([
  z.string().optional().describe("Name to greet"),
]);

export class HelloCommandParams extends CommandParams<
  z.infer<typeof HelloFlagsSchema>,
  z.infer<typeof HelloArgsSchema>
> {
  get Name(): string {
    return this.Arg(0) ?? "world";
  }

  get Loud(): boolean {
    return this.Flag("loud") ?? false;
  }
}

export class HelloCommand extends CommandRuntime<HelloCommandParams> {
  constructor(params: HelloCommandParams) {
    super(params, HelloArgsSchema, HelloFlagsSchema);
  }

  public override async Run(
    ctx: CommandContext,
    ioc: IoCContainer,
  ): Promise<void | number> {
    const { Name, Loud, DryRun } = this.Params;

    const sayHelloSvc = await ioc.Resolve<SayHello>(ioc.Symbol("SayHello"));

    let message = sayHelloSvc.Speak(Name);

    if (Loud) message = message.toUpperCase();

    if (DryRun) {
      ctx.Log.Info(`🛑 Dry run: "${message}" would have been printed.`);
    } else {
      ctx.Log.Info(`👋 ${message}`);
    }
  }

  public override BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Hello",
      "Prints a friendly greeting.",
    );
  }
}

export default defineCommandModule({
  FlagsSchema: HelloFlagsSchema,
  ArgsSchema: HelloArgsSchema,
  Params: HelloCommandParams,
  Command: HelloCommand,
});
