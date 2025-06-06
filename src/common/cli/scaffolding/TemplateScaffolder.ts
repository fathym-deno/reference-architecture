import { type DFSFileHandler, join } from "../.deps.ts";
import { Handlebars } from "../../../third-party/.exports.ts";
import type { TemplateLocator } from "../templates/TemplateLocator.ts";

export interface TemplateScaffoldOptions {
  /** Used to resolve files within a named template set */
  templateName: string;

  /** Where to write the scaffolded files within the DFS */
  outputDir?: string;

  /** Additional context to merge with base context (optional) */
  context?: Record<string, unknown>;
}

export class TemplateScaffolder {
  constructor(
    protected locator: TemplateLocator,
    public DFS: DFSFileHandler,
    protected baseContext: Record<string, unknown> = {},
  ) {}

  public async Scaffold(options: TemplateScaffoldOptions): Promise<void> {
    const { templateName, outputDir, context = {} } = options;

    const templatePath = `./templates/${templateName}`;

    const mergedContext = { ...this.baseContext, ...context };

    const files = await this.locator.ListFiles(templatePath);

    for (const filePath of files) {
      const relPath = filePath.replace(
        new RegExp(`^${templatePath}[\\\\/]?`),
        "",
      );

      const renderedPath = join(
        outputDir || ".",
        relPath.replace(/\.hbs$/, ""),
      );
      const raw = await this.locator.ReadTemplateFile(filePath);

      const rendered = filePath.endsWith(".hbs")
        ? Handlebars.compile(raw)(mergedContext)
        : raw;

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(rendered));
          controller.close();
        },
      });

      await this.DFS.WriteFile(renderedPath, stream);
    }
  }
}
