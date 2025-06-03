import {
  type CommandContext,
  CommandParams,
  CommandRuntime,
  defineCommandModule,
} from "@fathym/common/cli";
import { z } from "@fathym/common/third-party/zod";

export const FlagsSchema = z.object({});
export const ArgsSchema = z.tuple([]);

export class CloudCommandParams extends CommandParams<
  z.infer<typeof FlagsSchema>,
  z.infer<typeof ArgsSchema>
> {
  // Add getters here when flags/args grow
}

export class CloudCommand extends CommandRuntime<CloudCommandParams> {
  constructor(params: CloudCommandParams) {
    super(params, ArgsSchema, FlagsSchema);
  }

  public override Run(ctx: CommandContext): void | number {
    ctx.Log.Info("🔧 Scaffolding Cloud...");
  }

  public override BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Scaffold Cloud",
      "Generate a new Cloud file.",
    );
  }
}

export default defineCommandModule({
  FlagsSchema,
  ArgsSchema,
  Command: CloudCommand,
  Params: CloudCommandParams,
});
