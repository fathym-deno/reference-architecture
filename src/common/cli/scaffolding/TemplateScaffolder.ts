import { ensureDir } from "jsr:@std/fs@^1.0.11/ensure-dir";
import { join, relative } from "../.deps.ts";
import { walk } from "jsr:@std/fs@^1.0.11/walk";
import { Handlebars } from "../../../third-party/.exports.ts";

export interface TemplateScaffoldOptions {
  /** Required absolute path to root of templates (from CLI config) */
  templateRoot: string;

  /** Key-value pairs used for rendering template placeholders */
  context?: Record<string, unknown>;
}

export class TemplateScaffolder {
  protected templateRoot: string;
  protected context: Record<string, unknown>;

  constructor(options: TemplateScaffoldOptions) {
    this.templateRoot = options.templateRoot;
    this.context = options.context ?? {};
  }

  public async Scaffold(
    templateName: string,
    outputDir: string,
  ): Promise<void> {
    const from = join(this.templateRoot, templateName);

    try {
      const stat = await Deno.stat(from);
      if (!stat.isDirectory) {
        throw new Error(`Template "${templateName}" is not a directory`);
      }
    } catch {
      throw new Error(
        `Template "${templateName}" not found in ${this.templateRoot}`,
      );
    }

    await this.renderAllFiles(from, outputDir);
  }

  protected async renderAllFiles(
    fromDir: string,
    toDir: string,
  ): Promise<void> {
    for await (const entry of walk(fromDir, { includeDirs: false })) {
      const relPath = relative(fromDir, entry.path);
      const outPath = join(toDir, relPath.replace(/\.hbs$/, ""));

      await this.renderFile(entry.path, outPath);
    }
  }

  protected async renderFile(srcPath: string, destPath: string): Promise<void> {
    const raw = await Deno.readTextFile(srcPath);
    const rendered = Handlebars.compile(raw)(this.context);

    await ensureDir(join(destPath, ".."));
    await Deno.writeTextFile(destPath, rendered);
  }
}
