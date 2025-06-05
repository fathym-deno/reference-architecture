import type { DFSFileHandler } from "../.deps.ts";
import type { TemplateLocator } from "./TemplateLocator.ts";

export class DFSTemplateLocator implements TemplateLocator {
  constructor(
    protected dfs: DFSFileHandler,
    protected templateRoot = "", // Optionally namespace templates
  ) {}

  async ListFiles(templateName: string): Promise<string[]> {
    const allPaths = await this.dfs.LoadAllPaths("latest");
    const prefix = `${this.templateRoot}${templateName}/`;

    return allPaths.filter((p) => p.startsWith(prefix));
  }

  async ReadTemplateFile(path: string): Promise<string> {
    const fileInfo = await this.dfs.GetFileInfo(path);
    if (!fileInfo) throw new Error(`Template not found in DFS: ${path}`);

    return await new Response(fileInfo.Contents).text();
  }
}
