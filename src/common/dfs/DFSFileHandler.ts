import { getPackageLoggerSync, type Logger } from "./.deps.ts";
import type { DFSFileInfo } from "./DFSFileInfo.ts";
import type { IDFSFileHandler } from "./IDFSFileHandler.ts";

/**
 * Abstract base class implementing `IDFSFileHandler`.
 * Concrete implementations must provide method implementations.
 */
export abstract class DFSFileHandler<TDetails = Record<string, unknown>>
  implements IDFSFileHandler {
  protected readonly logger: Logger;

  /**
   * Creates an instance of `FetchDFSFileHandler`.
   * @param logger -The logger to use.
   */
  public constructor(
    protected details: TDetails,
    logger?: Logger,
  ) {
    this.logger = logger ?? getPackageLoggerSync(import.meta);
  }

  /**
   * The root directory for this DFS handler.
   */
  public abstract Root: string;

  /**
   * Retrieves file information from the DFS.
   * @param filePath - The relative file path.
   * @param revision - The revision or version identifier.
   * @param defaultFileName - The default file name (optional).
   * @param extensions - An array of allowed file extensions (optional).
   * @param useCascading - Whether to check cascading paths (optional).
   * @param cacheDb - A Deno.Kv instance for caching (optional).
   * @param cacheSeconds - The cache expiration in seconds (optional).
   * @returns A `DFSFileInfo` object if found, otherwise `undefined`.
   */
  public abstract GetFileInfo(
    filePath: string,
    defaultFileName?: string,
    extensions?: string[],
    useCascading?: boolean,
  ): Promise<DFSFileInfo | undefined>;

  /**
   * Loads all file paths available in the DFS for a given revision.
   * @param revision - The revision or version identifier.
   * @returns A list of file paths.
   */
  public abstract LoadAllPaths(revision: string): Promise<string[]>;

  /**
   * Removes a file from the DFS.
   * @param filePath - The relative file path.
   * @param revision - The revision or version identifier.
   * @param cacheDb - A Deno.Kv instance for caching (optional).
   */
  public abstract RemoveFile(
    filePath: string,
  ): Promise<void>;

  /**
   * Writes a file to the DFS.
   * @param filePath - The relative file path.
   * @param revision - The revision or version identifier.
   * @param stream - The file content as a `ReadableStream<Uint8Array>`.
   * @param ttlSeconds - Time-to-live in seconds (optional).
   * @param headers - Additional HTTP headers (optional).
   * @param maxChunkSize - The maximum chunk size for writing (optional, defaults to 8000).
   * @param cacheDb - A Deno.Kv instance for caching (optional).
   */
  public abstract WriteFile(
    filePath: string,
    stream: ReadableStream<Uint8Array>,
    ttlSeconds?: number,
    headers?: Headers,
    maxChunkSize?: number,
  ): Promise<void>;

  /**
   * Extracts headers from a response, excluding unnecessary ones.
   * @param response - The `Response` object from fetch.
   * @returns A filtered record of headers.
   */
  protected extractHeaders(response: Response): Record<string, string> {
    const excludeHeaders = new Set(["content-type"]);
    const headers: Record<string, string> = {};

    response.headers.forEach((value, key) => {
      if (!excludeHeaders.has(key)) {
        headers[key] = value;
      }
    });

    return headers;
  }
}
