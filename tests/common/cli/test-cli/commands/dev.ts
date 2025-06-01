import {
  Command,
  CommandParams,
  defineCommandModule,
} from "@fathym/common/cli";
import { z } from "../../../../test.deps.ts";

// 🔹 Flag and argument schemas
export const DevFlagsSchema = z.object({
  Verbose: z.boolean().optional().describe("Enable verbose logging"),
  Docker: z.boolean().optional().describe("Run in Docker"),
  "dry-run": z.boolean().optional().describe("Run without side effects"),
});

export const DevArgsSchema = z.tuple([
  z.string().optional().describe("Target workspace"),
]);

// 🔹 CLI parameter class — direct flag/arg accessors
export class DevCommandParams extends CommandParams<
  z.infer<typeof DevFlagsSchema>,
  z.infer<typeof DevArgsSchema>
> {
  public get Verbose(): boolean {
    return this.Flag("Verbose") ?? false;
  }

  public get Docker(): boolean {
    return this.Flag("Docker") ?? false;
  }

  public get Workspace(): string {
    return this.Arg(0) ?? "default";
  }
}

// 🔹 Command implementation — CLI logic + inferred metadata
export class DevCommand extends Command<DevCommandParams> {
  constructor(params: DevCommandParams) {
    super(params, DevArgsSchema, DevFlagsSchema);
  }

  public Run(): Promise<void> {
    if (this.Params.Verbose) {
      console.log("📣 Verbose mode enabled");
    }

    console.log("🔧 Running Open Industrial in dev mode...");
    console.log(`📁 Workspace: ${this.Params.Workspace}`);

    if (this.Params.Docker) {
      console.log("🐳 Launching in Docker...");
    } else {
      console.log("🧪 Launching in local dev mode...");
    }

    return Promise.resolve();
  }

  public BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Development Mode",
      "Run Open Industrial in dev mode",
    );
  }
}

export default defineCommandModule({
  FlagsSchema: DevFlagsSchema,
  ArgsSchema: DevArgsSchema,
  Command: DevCommand,
  Params: DevCommandParams,
});
