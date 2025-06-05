// deno-lint-ignore-file no-empty
import { dirname, existsSync, getFilesList, join } from "./.deps.ts";
import { DFSFileHandler } from "./DFSFileHandler.ts";
import type { DFSFileInfo } from "./DFSFileInfo.ts";
import { getFileCheckPathsToProcess } from "./getFileCheckPathsToProcess.ts";
import type { LocalDFSFileHandlerDetails } from "./LocalDFSFileHandlerDetails.ts";

/**
 * Implements `DFSFileHandler` for local file system storage.
 */
export class LocalDFSFileHandler
  extends DFSFileHandler<LocalDFSFileHandlerDetails> {
  public override get Root(): string {
    return this.details?.FileRoot?.endsWith("/")
      ? this.details.FileRoot
      : `${this.details.FileRoot}/`;
  }

  constructor(
    details: LocalDFSFileHandlerDetails,
    protected readonly pathResolver?: (filePath: string) => string,
  ) {
    super(details);
  }

  public async GetFileInfo(
    filePath: string,
    defaultFileName?: string,
    extensions?: string[],
    useCascading?: boolean,
  ): Promise<DFSFileInfo | undefined> {
    const fileCheckPaths = getFileCheckPathsToProcess(
      filePath,
      defaultFileName,
      extensions,
      useCascading,
    );

    for (const fcp of fileCheckPaths) {
      const resolvedPath = this.pathResolver ? this.pathResolver(fcp) : fcp;
      if (!resolvedPath) continue;

      const fullFilePath = join(
        this.Root.includes(":/") || this.Root.includes(":\\") ? "" : Deno.cwd(),
        this.Root || "",
        resolvedPath,
      );

      if (!existsSync(fullFilePath)) continue;

      try {
        // ✅ Read file contents into memory to avoid unclosed handle
        const bytes = await Deno.readFile(fullFilePath);

        // ✅ Optionally read headers if present
        let headers: Record<string, string> | undefined = undefined;
        const headersPath = `${fullFilePath}.headers.json`;

        if (existsSync(headersPath)) {
          try {
            const headerRaw = await Deno.readTextFile(headersPath);
            headers = JSON.parse(headerRaw);
          } catch {
            // Silently ignore malformed header file
          }
        }

        // ✅ Wrap bytes into a fresh stream
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(bytes);
            controller.close();
          },
        });

        return {
          Path: resolvedPath,
          Contents: stream,
          Headers: headers,
        };
      } catch {}
    }

    console.log(
      `Unable to locate a local file at path ${filePath}${
        defaultFileName
          ? `, and no default file was found for ${defaultFileName}.`
          : "."
      }`,
    );

    return undefined;
  }

  public async LoadAllPaths(): Promise<string[]> {
    const dir = await getFilesList({ Directory: this.Root });

    return Array.from(dir).map((entry) =>
      entry.startsWith(this.Root)
        ? `./${entry.substring(this.Root.length)}`
        : entry
    );
  }

  public async RemoveFile(filePath: string): Promise<void> {
    const fullPath = join(
      this.Root.includes(":/") || this.Root.includes(":\\") ? "" : Deno.cwd(),
      this.Root,
      filePath,
    );

    try {
      await Deno.remove(fullPath);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) return;
      throw err;
    }
  }

  public async WriteFile(
    filePath: string,
    stream: ReadableStream<Uint8Array>,
    _ttlSeconds?: number,
    headers?: Headers,
    _maxChunkSize = 8000,
  ): Promise<void> {
    const fullPath = join(
      this.Root.includes(":/") || this.Root.includes(":\\") ? "" : Deno.cwd(),
      this.Root,
      filePath,
    );

    // Ensure parent directory exists
    await Deno.mkdir(dirname(fullPath), { recursive: true });

    const file = await Deno.open(fullPath, {
      write: true,
      create: true,
      truncate: true,
    });

    await stream.pipeTo(file.writable);

    // Optionally write headers as a companion `.headers.json` file
    if (headers && [...headers.keys()].length > 0) {
      const headerObj: Record<string, string> = {};
      for (const [k, v] of headers.entries()) headerObj[k] = v;

      await Deno.writeTextFile(
        `${fullPath}.headers.json`,
        JSON.stringify(headerObj),
      );
    }
  }
}
