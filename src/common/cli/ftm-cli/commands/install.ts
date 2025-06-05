import { dirname, join, z } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import { CLIDFSContextManager } from "../../CLIDFSContextManager.ts";

export const InstallArgsSchema = z.tuple([]);

export const InstallFlagsSchema = z.object({
  to: z.string().optional().describe("Target install dir (default: ~/.bin)"),
  config: z.string().optional().describe(
    "Path to .cli.json (default: ./.cli.json)",
  ),
});

export class InstallParams extends CommandParams<
  z.infer<typeof InstallArgsSchema>,
  z.infer<typeof InstallFlagsSchema>
> {
  get To(): string {
    return this.Flag("to") ?? "~/.bin";
  }

  get ConfigPath(): string {
    return this.Flag("config") ?? "./.cli.json";
  }
}

export default Command(
  "install",
  "Install a compiled CLI binary to your system",
)
  .Args(InstallArgsSchema)
  .Flags(InstallFlagsSchema)
  .Params(InstallParams)
  .Services(async (ctx, ioc) => {
    const dfsCtx = await ioc.Resolve(CLIDFSContextManager);

    if (ctx.Params.ConfigPath) {
      await dfsCtx.RegisterProjectDFS(ctx.Params.ConfigPath, "CLI");
    }

    await dfsCtx.RegisterCustomDFS("INSTALL", {
      FileRoot: ctx.Params.To.replace(/^~(?=$|\/)/, Deno.env.get("HOME") ?? ""),
    });

    return {
      ConfigDFS: ctx.Params.ConfigPath
        ? await dfsCtx.GetDFS("CLI")
        : await dfsCtx.GetExecutionDFS(),
      InstallDFS: await dfsCtx.GetDFS("INSTALL"),
    };
  })
  .Run(async ({ Log, Services }) => {
    const { ConfigDFS, InstallDFS } = Services;
    const isWindows = Deno.build.os === "windows";

    const configPath = await ConfigDFS.ResolvePath(".cli.json");
    const configInfo = await ConfigDFS.GetFileInfo(configPath);

    if (!configInfo) {
      Log.Error(`❌ Could not find CLI config at: ${configPath}`);
      Deno.exit(1);
    }

    const configRaw = await new Response(configInfo.Contents).text();
    const config = JSON.parse(configRaw);
    const tokens: string[] = config.Tokens ?? ["cli"];

    if (!tokens.length) {
      Log.Error("❌ No tokens specified in CLI config.");
      Deno.exit(1);
    }

    const configDir = dirname(configPath);
    const binaryName = `${tokens[0]}${isWindows ? ".exe" : ""}`;
    const sourceBinaryPath = join(configDir, ".dist", binaryName);
    const targetBinaryPath = join(
      await InstallDFS.ResolvePath("."),
      binaryName,
    );

    await Deno.mkdir(await InstallDFS.ResolvePath("."), { recursive: true });
    await Deno.copyFile(sourceBinaryPath, targetBinaryPath);
    Log.Success(`✅ Installed: ${targetBinaryPath}`);

    for (const alias of tokens.slice(1)) {
      const aliasName = `${alias}${isWindows ? ".cmd" : ""}`;
      const aliasPath = join(await InstallDFS.ResolvePath("."), aliasName);

      const aliasContent = isWindows
        ? `@echo off\r\n${binaryName} %*`
        : `#!/bin/sh\nexec ${binaryName} "$@"`;

      await Deno.writeTextFile(aliasPath, aliasContent);
      if (!isWindows) {
        await Deno.chmod(aliasPath, 0o755);
      }

      Log.Info(`🔗 Alias installed: ${aliasPath}`);
    }

    const envPath = Deno.env.get("PATH") ?? "";
    const pathSep = isWindows ? ";" : ":";
    const installDir = await InstallDFS.ResolvePath(".");
    const inPath = envPath.split(pathSep).includes(installDir);

    if (!inPath) {
      Log.Warn(`⚠️  Install path (${installDir}) is not in your PATH`);
      Log.Info("👉 Add it to your shell profile to use CLI globally");
    }

    Log.Success("🎉 CLI installed successfully");
  });
