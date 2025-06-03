import { z } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import { join } from "../../.deps.ts";

export const CompileArgsSchema = z.tuple([]); // no positional args

export const CompileFlagsSchema = z.object({
  entry: z
    .string()
    .optional()
    .describe("Entry point file for the CLI (default: ./src/common/cli/cli-runtime.ts)"),

  output: z
    .string()
    .optional()
    .describe("Output filename for compiled CLI (default: ./build/ftm-cli)"),

  permissions: z
    .string()
    .optional()
    .describe("Deno permissions (default: --allow-all)"),
});

export class CompileParams extends CommandParams<
  z.infer<typeof CompileFlagsSchema>,
  z.infer<typeof CompileArgsSchema>
> {
  get Entry(): string {
    return this.Flag("entry") ?? "./src/common/cli/cli-runtime.ts";
  }

  get Output(): string {
    return this.Flag("output") ?? "./build/ftm-cli";
  }

  get Permissions(): string[] {
    return (this.Flag("permissions") ?? "--allow-all").split(" ");
  }
}

export default Command("compile", "Compile the CLI into a standalone binary")
  .Args(CompileArgsSchema)
  .Flags(CompileFlagsSchema)
  .Params(CompileParams)
  .Run(async ({ Params, Log }) => {
    const { Entry, Output, Permissions } = Params;

    Log.Info(`🔧 Compiling CLI:`);
    Log.Info(`- Entry: ${Entry}`);
    Log.Info(`- Output: ${Output}`);
    Log.Info(`- Permissions: ${Permissions.join(" ")}`);

    const compileProcess = new Deno.Command("deno", {
      args: ["compile", ...Permissions, "--output", Output, Entry],
      stdin: "null",
      stdout: "inherit",
      stderr: "inherit",
    });

    const result = await compileProcess.output();

    if (result.success) {
      Log.Success(`✅ Compilation complete! CLI binary at: ${Output}`);
    } else {
      Log.Error("❌ Compilation failed.");
      Deno.exit(result.code);
    }
  });
