import { ensureDir } from "jsr:@std/fs@^1.0.11/ensure-dir";
import { dirname, join } from "../.deps.ts";
import { Handlebars } from "../../../third-party/.exports.ts";
import type { TemplateLocator } from "../TemplateLocator.ts";

export interface TemplateScaffoldOptions {
  /** Used to resolve files within a named template set */
  templateName: string;

  /** Where to write the scaffolded files */
  outputDir: string;

  /** Additional context to merge with base context (optional) */
  context?: Record<string, unknown>;
}

export class TemplateScaffolder {
  constructor(
    protected locator: TemplateLocator,
    protected baseContext: Record<string, unknown> = {},
  ) {}

  public async Scaffold(options: TemplateScaffoldOptions): Promise<void> {
    const { templateName, outputDir, context = {} } = options;

    const mergedContext = { ...this.baseContext, ...context };

    const files = await this.locator.ListFiles(templateName);

    for (const filePath of files) {
      const relPath = filePath.replace(
        new RegExp(`^${templateName}[\\\\/]`),
        "",
      );

      const raw = await this.locator.ReadTemplateFile(filePath);

      const rendered = filePath.endsWith(".hbs")
        ? Handlebars.compile(raw)(mergedContext)
        : raw;

      const outPath = join(outputDir, relPath.replace(/\.hbs$/, ""));
      await ensureDir(dirname(outPath));
      await Deno.writeTextFile(outPath, rendered);
    }
  }
}
