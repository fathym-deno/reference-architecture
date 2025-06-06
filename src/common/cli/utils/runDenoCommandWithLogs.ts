import type { CommandLog } from "../commands/CommandLog.ts";

export async function runDenoCommandWithLogs(
  denoArgs: string[],
  log: CommandLog,
  {
    exitOnFail = true,
    stdin = "inherit",
    prefix = "",
  }: {
    exitOnFail?: boolean;
    stdin?: "inherit" | "null";
    prefix?: string;
  } = {},
): Promise<{ code: number; success: boolean }> {
  const cmd = new Deno.Command("deno", {
    args: denoArgs,
    stdin,
    stdout: "piped",
    stderr: "piped",
  });

  const proc = cmd.spawn();
  const { code, success } = await proc.status;

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  if (stdout.trim()) log.Info(`${prefix}${stdout.trim()}`);
  if (stderr.trim()) log.Error(`${prefix}${stderr.trim()}`);

  if (!success && exitOnFail) {
    log.Error(`❌ Command failed with exit code ${code}`);
    Deno.exit(code);
  }

  return { code, success };
}
