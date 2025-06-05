import {
  type DFSFileHandler,
  dirname,
  existsSync,
  fromFileUrl,
  type IoCContainer,
  join,
  LocalDFSFileHandler,
  type LocalDFSFileHandlerDetails,
  resolve,
} from "./.deps.ts";

export class CLIDFSContextManager {
  constructor(protected ioc: IoCContainer) {}

  // ─── DFS Registration Methods ─────────────────────────────────────────

  public RegisterProjectDFS(fileUrlInProject: string): void {
    const localPath = dirname(fromFileUrl(fileUrlInProject));
    const projectRoot = this.findProjectRoot(localPath);

    this.ioc.Register(
      LocalDFSFileHandler,
      () => new LocalDFSFileHandler({ FileRoot: projectRoot }),
      {
        Name: "project",
      },
    );
  }

  public RegisterExecutionDFS(cwd: string = Deno.cwd()): void {
    this.ioc.Register(
      LocalDFSFileHandler,
      () => new LocalDFSFileHandler({ FileRoot: cwd }),
      {
        Name: "execution",
      },
    );
  }

  public RegisterCustomDFS(
    name: string,
    details: LocalDFSFileHandlerDetails,
  ): void {
    this.ioc.Register(
      LocalDFSFileHandler,
      () => new LocalDFSFileHandler(details),
      {
        Name: name,
      },
    );
  }

  // ─── DFS Access Utilities ─────────────────────────────────────────────

  public async GetDFS(
    name: "project" | "execution" | string,
  ): Promise<DFSFileHandler> {
    const dfs = await this.ioc.Resolve(LocalDFSFileHandler, name);

    if (!dfs) {
      throw new Error(`DFS "${name}" not registered.`);
    }

    return dfs;
  }

  public async ResolvePath(scope: string, ...parts: string[]): Promise<string> {
    const base = (await this.GetDFS(scope)).Root;

    return resolve(base, ...parts);
  }

  // ─── Internal Root Discovery ──────────────────────────────────────────

  protected findProjectRoot(startDir: string): string {
    let current = startDir;
    while (true) {
      const candidate = join(current, ".cli.json");
      if (existsSync(candidate)) return current;

      const parent = dirname(current);
      if (parent === current) {
        throw new Error(`No .cli.json found walking up from: ${startDir}`);
      }
      current = parent;
    }
  }
}
