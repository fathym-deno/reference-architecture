import { findClosestMatch } from './.deps.ts';
import type { CommandModuleMetadata } from './.exports.ts';
import type { CLIConfig } from './CLIConfig.ts';
import type { CLIHelp } from './CLIHelp.ts';
import type { CLIResolvedEntry } from './CLIResolvedEntry.ts';
import { loadModuleMetadata } from './loadModuleMetadata.ts';

export class DefaultCLIHelp implements CLIHelp {
  /**
   * Displays the help UI for the root CLI context.
   */
  public async ShowRoot(
    config: CLIConfig,
    commands: Map<string, CLIResolvedEntry>
  ) {
    console.log(`\n📘 ${config.Name} CLI v${config.Version}`);

    if (config.Description) {
      console.log(config.Description);
    }

    const token =
      config.Tokens?.[0] ?? config.Name.toLowerCase().replace(/\s+/g, '-');
    console.log(`\nUsage:\n  ${token} <command> [options]`);

    const exampleList = await this.collectExamples(commands);
    if (exampleList.length) {
      console.log(`\nExamples:`);
      for (const ex of exampleList) {
        console.log(`  ${token} ${ex}`);
      }
    }

    // Display available commands
    await this.renderCommandsList(config, commands, undefined);
  }

  /**
   * Displays the help UI for a specific command using its metadata.
   */
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

    console.log('');
  }

  /**
   * Displays the help UI for a specific group of commands.
   */
  public async ShowGroup(
    group: string,
    config: CLIConfig,
    subcommands: Map<string, CLIResolvedEntry>,
    metadata?: CommandModuleMetadata
  ) {
    const token =
      config.Tokens?.[0] ?? config.Name.toLowerCase().replace(/\s+/g, '-');

    console.log(`\n📘 ${config.Name} – Group: ${metadata?.Name ?? group}`);

    if (metadata?.Description) {
      console.log(metadata.Description);
    }

    console.log(`\nUsage:\n  ${token} ${group} <command> [options]`);

    const exampleList = await this.collectExamples(subcommands);
    if (exampleList.length) {
      console.log(`\nExamples:`);
      for (const ex of exampleList) {
        console.log(`  ${token} ${group} ${ex}`);
      }
    }

    // Display available subcommands
    await this.renderCommandsList(config, subcommands, group);
  }

  /**
   * Displays the help UI for an unknown command.
   */
  public ShowUnknown(key: string, commands: Map<string, CLIResolvedEntry>) {
    console.error(`❌ Unknown command: ${key}`);

    const guess = findClosestMatch(key, [...commands.keys()]);
    if (guess) {
      console.log(`💡 Did you mean: ${guess}?`);
    }
  }

  /**
   * Collect examples from the modules and commands.
   */
  private async collectExamples(
    commands: Map<string, CLIResolvedEntry>
  ): Promise<string[]> {
    const examples: string[] = [];

    for (const [_, entry] of commands.entries()) {
      try {
        const { Path } = entry[0]!; // Access the Path from the first part of the tuple

        if (Path) {
          // Load the module and collect examples
          const mod = await loadModuleMetadata(Path);
          if (mod?.Examples?.length) {
            examples.push(...mod.Examples);
          }
        }
      } catch (err) {
        console.warn(
          `Failed to collect examples for command at ${entry[0]!.Path}`
        );
      }
    }

    return examples;
  }

  /**
   * Helper to display commands (both for root and group views)
   */
  private async renderCommandsList(
    config: CLIConfig,
    commands: Map<string, CLIResolvedEntry>,
    groupKey: string | undefined
  ) {
    const token =
      config.Tokens?.[0] ?? config.Name.toLowerCase().replace(/\s+/g, '-');
    console.log(`\nAvailable Commands:`);

    const seen = new Set<string>();
    for (const [key, entry] of commands.entries()) {
      if (groupKey && !key.startsWith(groupKey)) continue; // Only show subcommands if in the group

      const group = key.split('/')[0]; // Group identifier
      if (!seen.has(group)) {
        seen.add(group);
        console.log(`  ${group}`);
      }
    }

    console.log(`\nUse '--help' with any command to view details.\n`);
  }
}
