import type { CLIConfig } from './CLIConfig.ts';
import type { CommandModuleMetadata } from './commands/CommandModuleMetadata.ts';

/**
 * Interface for rendering help information in a CLI.
 */
export interface CLIHelp {
  /**
   * Show help UI for the root CLI context.
   * @param config The top-level CLI configuration.
   * @param commands A map of available CLI command routes (lazy-loaded).
   */
  ShowRoot(config: CLIConfig, commands: Map<string | number, { Path: string }>): void;

  /**
   * Show help UI for a specific command using its metadata.
   * @param key The CLI route used to invoke the command.
   * @param metadata The metadata returned by BuildMetadata().
   */
  ShowCommand(key: string | number, metadata: CommandModuleMetadata): void;

  /**
   * Show help UI for an unknown command with closest match suggestions.
   * @param key The unrecognized CLI input key.
   * @param commands A map of available CLI routes (lazy-loaded).
   */
  ShowUnknown(key: string | number, commands: Map<string | number, { Path: string }>): void;
}
