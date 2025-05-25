import type { Help } from "./CLI.ts";
import type { CLIConfig } from "./CLIConfig.ts";
import type { CommandModule } from "./commands/CommandModule.ts";

export class DefaultHelp implements Help {
  public ShowRoot(config: CLIConfig, commands: Map<string, { Path: string }>) {
    console.log(`\n📘 ${config.Name} CLI v${config.Version}`);
    if (config.Description) console.log(config.Description);

    console.log(
      `\nUsage:\n  ${
        config.Help?.Usage ?? `${config.Name} <command> [options]`
      }`,
    );

    if (config.Help?.Examples?.length) {
      console.log(`\nExamples:`);
      for (const ex of config.Help.Examples) {
        console.log(`  ${ex}`);
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

  public ShowCommand(key: string, metadata?: CommandModule["Metadata"]) {
    console.log(`\n📘 Help: ${metadata?.Name ?? key}`);
    if (metadata?.Description) console.log(metadata.Description);
    console.log(`\nUsage:\n  ${metadata?.Usage ?? `${key} [options]`}`);

    if (metadata?.Examples?.length) {
      console.log(`\nExamples:`);
      for (const ex of metadata.Examples) console.log(`  ${ex}`);
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

function findClosestMatch(
  input: string,
  options: string[],
): string | undefined {
  let bestScore = Infinity;
  let bestMatch: string | undefined;

  for (const option of options) {
    const score = levenshtein(input, option);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = option;
    }
  }

  return bestScore <= 3 ? bestMatch : undefined; // adjust threshold
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1] ? matrix[i - 1][j - 1] : Math.min(
        matrix[i - 1][j - 1] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1,
      );
    }
  }

  return matrix[b.length][a.length];
}
