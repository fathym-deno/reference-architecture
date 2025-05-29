import type { CLICommandEntry } from './CLICommandEntry.ts';

export type CLIResolvedEntry = [
  command?: CLICommandEntry,
  metadata?: CLICommandEntry
];
