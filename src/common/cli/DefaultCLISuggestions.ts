import { findClosestMatch } from './.deps.ts';
import type { Command } from './commands/Command.ts';
import type { CommandSuggestions } from './commands/CommandSuggestions.ts';
import type { CLISuggestions } from './CLISuggestions.ts';

export class DefaultCLISuggestions implements CLISuggestions {
  SuggestCommands(partial: string, keys: string[]): string[] {
    const match = findClosestMatch(partial, keys);
    return match ? [match] : [];
  }

  SuggestForCommand(_key: string, command: Command): CommandSuggestions {
    return command.BuildSuggestions?.() ?? {};
  }
}
