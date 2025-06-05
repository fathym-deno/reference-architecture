/**
 * Represents details for a Local File System-backed Distributed File System (DFS) in Everything as Code (EaC).
 *
 * This type extends `EaCDistributedFileSystemDetails` with Local-specific properties.
 */
export type LocalDFSFileHandlerDetails = {
  /** The root path in the local file system. */
  FileRoot: string;

  /** The database lookup for caching mechanisms. */
  CacheDBLookup?: string;

  /** The cache expiration time in seconds. */
  CacheSeconds?: number;

  /** The default file to serve when no specific file is requested. */
  DefaultFile?: string;

  /** A list of supported file extensions in this DFS. */
  Extensions?: string[];

  /** Whether cascading behavior is enabled. */
  UseCascading?: boolean;

  /** The path used for DFS workers. */
  WorkerPath?: string;

  /** The description of the vertex. */
  Description?: string;

  /** The name of the vertex. */
  Name?: string;
};
