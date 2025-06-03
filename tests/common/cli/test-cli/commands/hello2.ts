import {
  type CommandContext,
  CommandRuntime,
  defineCommandModule,
} from "@fathym/common/cli";
import type { IoCContainer } from "../../../../../src/common/cli/.deps.ts";
import type { SayHello } from "../.cli.init.ts";
import {
  HelloArgsSchema,
  HelloCommandParams,
  HelloFlagsSchema,
} from "./hello.ts";

export class HelloCommand2 extends CommandRuntime<HelloCommandParams> {
  public override async Run(
    ctx: CommandContext<HelloCommandParams>,
    ioc: IoCContainer,
  ): Promise<void | number> {
    const { Name, Loud, DryRun } = ctx.Params;

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
      HelloArgsSchema,
      HelloFlagsSchema,
    );
  }
}

export default defineCommandModule({
  FlagsSchema: HelloFlagsSchema,
  ArgsSchema: HelloArgsSchema,
  Params: HelloCommandParams,
  Command: HelloCommand2,
});
