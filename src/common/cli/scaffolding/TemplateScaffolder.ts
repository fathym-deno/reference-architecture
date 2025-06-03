import { ensureDir } from "jsr:@std/fs@^1.0.11/ensure-dir";
import { dirname, join } from "../.deps.ts";
import { Handlebars } from "../../../third-party/.exports.ts";
import type { TemplateLocator } from "../TemplateLocator.ts";

export interface TemplateScaffoldOptions {
  /** Used to resolve files within a named template set */
  templateName: string;

  /** Where to write the scaffolded files */
  outputDir: string;

  /** Key-value pairs used for rendering template placeholders */
  context?: Record<string, unknown>;
}

export class TemplateScaffolder {
  constructor(
    protected locator: TemplateLocator,
    protected context: Record<string, unknown> = {},
  ) {}

  public async Scaffold(options: TemplateScaffoldOptions): Promise<void> {
    const { templateName, outputDir } = options;

    const files = await this.locator.ListFiles(templateName);

    for (const filePath of files) {
      const relPath = filePath.replace(`${templateName}/`, "");
      const raw = await this.locator.ReadTemplateFile(filePath);

      const rendered = filePath.endsWith(".hbs")
        ? Handlebars.compile(raw)(this.context)
        : raw;

      const outPath = join(outputDir, relPath.replace(/\.hbs$/, ""));
      await ensureDir(dirname(outPath));
      await Deno.writeTextFile(outPath, rendered);
    }
  }
}
