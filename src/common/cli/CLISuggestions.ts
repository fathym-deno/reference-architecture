import type { Command } from "./commands/Command.ts";
import type { CommandSuggestions } from './commands/CommandSuggestions.ts';

export interface CLISuggestions {
  /**
   * Suggest command names based on a partial input.
   */
  SuggestCommands(partial: string, keys: string[]): string[];

  /**
   * Get suggestions for flags/args of a specific command.
   */
  SuggestForCommand(key: string, command: Command): CommandSuggestions;
}
