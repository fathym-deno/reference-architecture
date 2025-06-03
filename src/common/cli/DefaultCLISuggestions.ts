import { findClosestMatch } from "./.deps.ts";
import type { CommandRuntime } from "./commands/CommandRuntime.ts";
import type { CommandSuggestions } from "./commands/CommandSuggestions.ts";
import type { CLISuggestions } from "./CLISuggestions.ts";

export class DefaultCLISuggestions implements CLISuggestions {
  SuggestCommands(partial: string, keys: string[]): string[] {
    const match = findClosestMatch(partial, keys);
    return match ? [match] : [];
  }

  SuggestForCommand(_key: string, command: CommandRuntime): CommandSuggestions {
    return command.Suggestions?.() ?? {};
  }
}
