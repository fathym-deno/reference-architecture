import type { TemplateLocator } from "./TemplateLocator.ts";

/**
 * TemplateLocator implementation that reads from a preloaded in-memory map.
 * Typically used in statically compiled CLI binaries.
 */

export class EmbeddedTemplateLocator implements TemplateLocator {
  constructor(
    protected templates: Record<string, string>
  ) { }

  public async ListFiles(templateName: string): Promise<string[]> {
    const prefix = templateName.endsWith("/") ? templateName : `${templateName}/`;

    return Object.keys(this.templates).filter((key) => key.startsWith(prefix) && !key.endsWith("/")
    );
  }

  public async ReadTemplateFile(path: string): Promise<string> {
    const contents = this.templates[path];
    if (contents === undefined) {
      throw new Error(`Template not found: ${path}`);
    }

    return contents;
  }
}
