import {
  Command,
  CommandParams,
  defineCommandModule,
} from "@fathym/common/cli";
import { z } from "../../../../../test.deps.ts";

// 🔹 Flag and argument schemas (placeholder for now)
export const FlagsSchema = z.object({});
export const ArgsSchema = z.tuple([]);

// 🔹 CLI params class with direct accessors (can grow later)
export class CloudCommandParams extends CommandParams<
  z.infer<typeof FlagsSchema>,
  z.infer<typeof ArgsSchema>
> {
  // Add getters here when flags/args grow
}

// 🔹 Command implementation — includes CLI lifecycle + metadata
export class CloudCommand extends Command<CloudCommandParams> {
  constructor(params: CloudCommandParams) {
    super(params, ArgsSchema, FlagsSchema);
  }

  public Run(): Promise<void> {
    console.log("🔧 Scaffolding Cloud...");

    return Promise.resolve();
  }

  public BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Scaffold Cloud",
      "Generate a new Cloud file.",
    );
  }
}

// 🔹 Final CLI module export using the helper
export default defineCommandModule({
  FlagsSchema,
  ArgsSchema,
  Command: CloudCommand,
  Params: CloudCommandParams,
});
