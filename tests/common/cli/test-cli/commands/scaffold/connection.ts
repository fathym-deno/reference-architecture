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
export class ConnectionCommandParams extends CommandParams<
  z.infer<typeof FlagsSchema>,
  z.infer<typeof ArgsSchema>
> {
  // Add getters here when flags/args grow
}

// 🔹 Command implementation — includes CLI lifecycle + metadata
export class ConnectionCommand extends Command<ConnectionCommandParams> {
  constructor(params: ConnectionCommandParams) {
    super(params, ArgsSchema, FlagsSchema);
  }

  public Run(): Promise<void> {
    console.log("🔧 Scaffolding connection...");

    return Promise.resolve();
  }

  public BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Scaffold Connection",
      "Generate a new connection file.",
    );
  }
}

// 🔹 Final CLI module export using the helper
export default defineCommandModule({
  FlagsSchema,
  ArgsSchema,
  Command: ConnectionCommand,
  Params: ConnectionCommandParams,
});
