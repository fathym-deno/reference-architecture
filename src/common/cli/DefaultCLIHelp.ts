import type { CLIHelp } from "./CLIHelp.ts";
import type { CLIConfig } from "./CLIConfig.ts";
import type { CommandModuleMetadata } from "./commands/CommandModuleMetadata.ts";
import { findClosestMatch, toFileUrl } from "./.deps.ts";
import type { CommandModule } from "./commands/CommandModule.ts";

/**
 * Default implementation for CLI help rendering.
 */
export class DefaultCLIHelp implements CLIHelp {
  public async ShowRoot(config: CLIConfig, commands: Map<string, { Path: string }>) {
    console.log(`\n📘 ${config.Name} CLI v${config.Version}`);

    if (config.Description) {
      console.log(config.Description);
    }

    const token = config.Tokens?.[0] ?? config.Name.toLowerCase().replace(/\s+/g, "-");

    console.log(`\nUsage:\n  ${token} <command> [options]`);

    const exampleList = await collectExamples(commands);
    if (exampleList.length) {
      console.log(`\nExamples:`);
      for (const ex of exampleList) {
        console.log(`  ${token} ${ex}`);
      }
    }

    const seen = new Set<string>();
    console.log(`\nAvailable Commands:`);

    for (const key of commands.keys()) {
      const top = key.split("/")[0];
      if (!seen.has(top)) {
        seen.add(top);
        console.log(`  ${top}`);
      }
    }

    console.log(`\nUse '--help' with any command to view details.\n`);
  }

  public ShowCommand(key: string, metadata: CommandModuleMetadata) {
    console.log(`\n📘 Help: ${metadata?.Name ?? key}`);

    if (metadata?.Description) {
      console.log(metadata.Description);
    }

    console.log(`\nUsage:\n  ${metadata?.Usage ?? `${key} [options]`}`);

    if (metadata?.Examples?.length) {
      console.log(`\nExamples:`);
      for (const ex of metadata.Examples) {
        console.log(`  ${ex}`);
      }
    }

    console.log("");
  }

  public ShowUnknown(key: string, commands: Map<string, { Path: string }>) {
    console.error(`❌ Unknown command: ${key}`);

    const guess = findClosestMatch(key, [...commands.keys()]);
    if (guess) {
      console.log(`💡 Did you mean: ${guess}?`);
    }
  }
}

/**
 * Lazily loads command modules to collect usage examples for CLI root help.
 */
async function collectExamples(commands: Map<string, { Path: string }>): Promise<string[]> {
  const examples: string[] = [];

  for (const [_, { Path }] of commands.entries()) {
    try {
      const mod: CommandModule = (await import(toFileUrl(Path).href)).default;
      const instance = new mod.Command(new mod.Params!({}, []));
      const metadata = instance.BuildMetadata();
      if (metadata?.Examples?.length) {
        examples.push(...metadata.Examples);
      }
    } catch {
      // Ignore broken or missing modules
    }
  }

  return examples;
}
