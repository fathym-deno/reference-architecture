// 🔹 Defines the structured metadata for each CLI command
export type CommandModuleMetadata = {
  /**
   * A short, human-readable label for the command.
   * Displayed in help UIs, headers, and listings.
   * Examples: "Development Mode", "Publish Artifacts", "Scaffold Schema".
   */
  Name: string;

  /**
   * Optional override for the CLI route/token used to invoke the command.
   * If not provided, the system uses the file/folder path as the default token.
   * Examples: "dev", "publish", "scaffold/schema"
   */
  Token?: string;

  /**
   * A brief description of what this command does.
   * Used in CLI help, docs, and introspection.
   */
  Description?: string;

  /**
   * Example invocations of this command.
   * Used in CLI help under an "Examples" section.
   * Examples: ["oi dev", "oi publish --dry-run"]
   */
  Examples?: string[];

  /**
   * A usage string that shows how to invoke the command.
   * If not provided, the system may derive one from the schema.
   * Example: "oi dev [workspace] [--Verbose] [--Docker]"
   */
  Usage?: string;
};
