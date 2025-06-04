import { resolve, join, dirname, exists } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import { z } from "../../.deps.ts";

export const CompileArgsSchema = z.tuple([]);

export const CompileFlagsSchema = z.object({
  entry: z
    .string()
    .optional()
    .describe("Entry point file for the CLI (default: ./_build/cli.ts)"),

  config: z
    .string()
    .optional()
    .describe("Path to .cli.json (default: alongside entry file)"),

  output: z
    .string()
    .optional()
    .describe("Output folder for compiled binaries (default: ./dist)"),

  permissions: z
    .string()
    .optional()
    .describe("Deno permissions (default: --allow-read --allow-env --allow-net)"),
});

export class CompileParams extends CommandParams<
  z.infer<typeof CompileFlagsSchema>,
  z.infer<typeof CompileArgsSchema>
> {
  get Entry(): string {
    return resolve(this.Flag("entry") ?? "./_build/cli.ts");
  }

  get ConfigPath(): string {
    return resolve(this.Flag("config") ?? join(dirname(this.Entry), "../.cli.json"));
  }

  get OutputDir(): string {
    return resolve(this.Flag("output") ?? "./dist");
  }

  get Permissions(): string[] {
    return (this.Flag("permissions") ?? "--allow-read --allow-env --allow-net").split(" ");
  }
}

export default Command("compile", "Compile the CLI into binaries for each token")
  .Args(CompileArgsSchema)
  .Flags(CompileFlagsSchema)
  .Params(CompileParams)
  .Run(async ({ Params, Log }) => {
    const { Entry, OutputDir, Permissions, ConfigPath } = Params;

    if (!(await exists(ConfigPath))) {
      Log.Error(`❌ Could not find CLI config at: ${ConfigPath}`);
      Deno.exit(1);
    }

    const configRaw = await Deno.readTextFile(ConfigPath);
    const config = JSON.parse(configRaw);

    const tokens: string[] = config.Tokens ?? ["cli"];

    Log.Info(`🔧 Compiling CLI for tokens: ${tokens.join(", ")}`);
    Log.Info(`- Entry: ${Entry}`);
    Log.Info(`- Output dir: ${OutputDir}`);
    Log.Info(`- Permissions: ${Permissions.join(" ")}`);

    for (const token of tokens) {
      const outputPath = join(OutputDir, token);

      Log.Info(`🛠️ Compiling binary for: ${token}`);

      const compile = new Deno.Command("deno", {
        args: ["compile", ...Permissions, "--output", outputPath, Entry],
        stdin: "null",
        stdout: "inherit",
        stderr: "inherit",
      });

      const result = await compile.output();

      if (!result.success) {
        Log.Error(`❌ Failed to compile binary for token: ${token}`);
        Deno.exit(result.code);
      }

      Log.Success(`✅ Compiled: ${outputPath}`);
    }

    Log.Success("🎉 All CLI binaries compiled successfully.");
  });
