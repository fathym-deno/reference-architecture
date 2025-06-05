import { dirname, join, z } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import BuildCommand from "./build.ts";
import { CLIDFSContextManager } from "../../CLIDFSContextManager.ts";

export const CompileArgsSchema = z.tuple([]);

export const CompileFlagsSchema = z.object({
  entry: z
    .string()
    .optional()
    .describe("Entry point file for the CLI (default: ./.build/cli.ts)"),
  config: z
    .string()
    .optional()
    .describe("Path to .cli.json (default: alongside entry file)"),
  output: z
    .string()
    .optional()
    .describe("Output folder for compiled binaries (default: ./.dist)"),
  permissions: z
    .string()
    .optional()
    .describe("Deno permissions (default: full access)"),
});

export class CompileParams extends CommandParams<
  z.infer<typeof CompileArgsSchema>,
  z.infer<typeof CompileFlagsSchema>
> {
  get Entry(): string {
    return this.Flag("entry") ?? "./.build/cli.ts";
  }

  get ConfigPath(): string | undefined {
    return this.Flag("config");
  }

  get OutputDir(): string {
    return this.Flag("output") ?? "./.dist";
  }

  get Permissions(): string[] {
    return (
      this.Flag("permissions")?.split(" ") ?? [
        "--allow-read",
        "--allow-env",
        "--allow-net",
        "--allow-write",
        "--allow-run",
      ]
    );
  }
}

export default Command(
  "compile",
  "Compile the CLI into binaries for each token",
)
  .Args(CompileArgsSchema)
  .Flags(CompileFlagsSchema)
  .Params(CompileParams)
  .Commands({
    Build: BuildCommand.Build(),
  })
  .Services(async (ctx, ioc) => {
    const dfsCtx = await ioc.Resolve(CLIDFSContextManager);

    await dfsCtx.RegisterProjectDFS(ctx.Params.Entry, "CLI");

    return {
      CLIDFS: await dfsCtx.GetDFS("CLI"),
    };
  })
  .Run(async ({ Params, Log, Commands, Services }) => {
    const { CLIDFS } = Services;

    const entryPath = await CLIDFS.ResolvePath(Params.Entry);
    const configPath = await CLIDFS.ResolvePath(
      Params.ConfigPath ?? join(dirname(Params.Entry), "../.cli.json"),
    );
    const outputDir = await CLIDFS.ResolvePath(Params.OutputDir);
    const permissions = Params.Permissions;

    const configInfo = await CLIDFS.GetFileInfo(configPath);
    if (!configInfo) {
      Log.Error(`❌ Could not find CLI config at: ${configPath}`);
      Deno.exit(1);
    }

    const configRaw = await new Response(configInfo.Contents).text();
    const config = JSON.parse(configRaw);
    const tokens: string[] = config.Tokens ?? ["cli"];

    Log.Info(`🔧 Compiling CLI for tokens: ${tokens.join(", ")}`);
    Log.Info(`- Entry: ${entryPath}`);
    Log.Info(`- Output dir: ${outputDir}`);
    Log.Info(`- Permissions: ${permissions.join(" ")}`);

    // Always build first
    const { Build } = Commands!;
    await Build([], { config: configPath });

    for (const token of tokens) {
      const outputPath = join(outputDir, token);
      Log.Info(`🛠️ Compiling binary for: ${token}`);

      const compile = new Deno.Command("deno", {
        args: ["compile", ...permissions, "--output", outputPath, entryPath],
        stdin: "null",
        stdout: "inherit",
        stderr: "inherit",
      });

      const result = await compile.output();
      if (!result.success) {
        Log.Error(`❌ Failed to compile binary for token: ${token}`);
        Deno.exit(result.code);
      }

      Log.Success(`Compiled: ${outputPath}`);
    }

    Log.Success("🎉 All CLI binaries compiled successfully.");
  });
