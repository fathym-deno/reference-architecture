import type { CLIConfig } from './CLIConfig.ts';
import type { CommandModuleMetadata } from './commands/CommandModuleMetadata.ts';
import type { CLIResolvedEntry } from './CLIResolvedEntry.ts';

/**
 * Interface for rendering help information in a CLI.
 * This defines the structure of help handling across the CLI system, including root-level help, command-specific help, and unknown command handling.
 */
export interface CLIHelp {
  /**
   * Displays the help UI for the root CLI context.
   * This typically includes the CLI name, version, description, available commands, and examples of usage.
   *
   * @param config The configuration of the CLI (name, version, description, etc.).
   * @param commands A map of available CLI command routes, keyed by their unique identifiers, including metadata.
   */
  ShowRoot(config: CLIConfig, commands: Map<string, CLIResolvedEntry>): void;

  /**
   * Displays the help UI for a specific command using its metadata.
   * This includes the name, description, usage, and examples of how to invoke the command.
   *
   * @param key The unique CLI route for the command (e.g., "dev", "scaffold/schema").
   * @param metadata The metadata returned by BuildMetadata() for the specific command.
   */
  ShowCommand(key: string, metadata: CommandModuleMetadata): void;

  /**
   * Displays the help UI for a specific group of commands.
   * A group typically represents a set of related commands (e.g., `scaffold`, `deploy`).
   * This method will list subcommands under the group and display their help.
   *
   * @param group The name of the command group (e.g., "scaffold", "deploy").
   * @param config The top-level CLI configuration.
   * @param subcommands A map of subcommands within the group, keyed by their names.
   * @param metadata (Optional) The metadata for the group, if available. This can be used to display a description or usage information for the entire group.
   */
  ShowGroup(
    group: string,
    config: CLIConfig,
    subcommands: Map<string, CLIResolvedEntry>,
    metadata?: CommandModuleMetadata
  ): void | Promise<void>;

  /**
   * Displays the help UI for an unknown command.
   * It provides a helpful message indicating that the command was not recognized,
   * and can optionally suggest close matches to the input command.
   *
   * @param key The unrecognized CLI input key (e.g., "scaffold/unknown").
   * @param commands A map of available CLI routes, used to suggest close matches for the unknown command.
   */
  ShowUnknown(key: string, commands: Map<string, CLIResolvedEntry>): void;
}
