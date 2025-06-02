import {
  Command,
  type CommandContext,
  CommandParams,
  defineCommandModule,
} from "@fathym/common/cli";
import { z } from "@fathym/common/third-party/zod";

export const FlagsSchema = z.object({});
export const ArgsSchema = z.tuple([]);

export class AzureCommandParams extends CommandParams<
  z.infer<typeof FlagsSchema>,
  z.infer<typeof ArgsSchema>
> {
  // Add getters here when flags/args grow
}

export class AzureCommand extends Command<AzureCommandParams> {
  constructor(params: AzureCommandParams) {
    super(params, ArgsSchema, FlagsSchema);
  }

  public override Run(ctx: CommandContext): void | number {
    ctx.Log.Info("🔧 Scaffolding Azure...");
  }

  public override BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Scaffold Azure",
      "Generate a new Azure file.",
    );
  }
}

export default defineCommandModule({
  FlagsSchema,
  ArgsSchema,
  Command: AzureCommand,
  Params: AzureCommandParams,
});
