import { z } from "@fathym/common/third-party/zod";
import {
  CommandParams,
  CommandRuntime,
  defineCommandModule,
} from "@fathym/common/cli";

// 🧩 Define schemas
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

// 🧩 Parameter class
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

// 🚀 Command logic
export class HelloCommand extends CommandRuntime<HelloCommandParams> {
  constructor(params: HelloCommandParams) {
    super(params, HelloArgsSchema, HelloFlagsSchema);
  }

  public Run(): Promise<void> {
    const { Name, Loud, DryRun } = this.Params;

    let message = `Hello, ${Name}!`;
    if (Loud) message = message.toUpperCase();

    if (DryRun) {
      console.log(`🛑 Dry run: "${message}" would have been printed.`);
    } else {
      console.log(`👋 ${message}`);
    }

    return Promise.resolve();
  }

  public BuildMetadata() {
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
