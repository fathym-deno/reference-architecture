import {
  Command,
  CommandParams,
  defineCommandModule,
} from "@fathym/common/cli";
import { z } from "../../../../../../test.deps.ts";

// 🔹 Flag and argument schemas (placeholder for now)
export const FlagsSchema = z.object({});
export const ArgsSchema = z.tuple([]);

// 🔹 CLI params class with direct accessors (can grow later)
export class AWSCommandParams extends CommandParams<
  z.infer<typeof FlagsSchema>,
  z.infer<typeof ArgsSchema>
> {
  // Add getters here when flags/args grow
}

// 🔹 Command implementation — includes CLI lifecycle + metadata
export class AWSCommand extends Command<AWSCommandParams> {
  constructor(params: AWSCommandParams) {
    super(params, ArgsSchema, FlagsSchema);
  }

  public Run(): Promise<void> {
    console.log("🔧 Scaffolding AWS...");

    return Promise.resolve();
  }

  public BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Scaffold AWS",
      "Generate a new AWS file.",
    );
  }
}

// 🔹 Final CLI module export using the helper
export default defineCommandModule({
  FlagsSchema,
  ArgsSchema,
  Command: AWSCommand,
  Params: AWSCommandParams,
});
