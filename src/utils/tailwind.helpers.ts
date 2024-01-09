import * as path from "$std/path/mod.ts";
import { FileListInput, getFilesList } from "./path.ts";

export type TailwindComponentsConfig = { Root: string; Components: string[] };

export async function buildTailwindComponentsConfigs(
  compConfigs: TailwindComponentsConfig[],
): Promise<void> {
  const fileContentCalls = compConfigs.reduce((prev, cc) => {
    if (cc.Root.startsWith("file:///")) {
      prev.push(
        ...cc.Components.map((comp) => {
          const fileUrl = path.fromFileUrl(`${cc.Root}${comp}`);

          return Deno.readTextFile(fileUrl);
        }),
      );
    } else {
      prev.push(
        ...cc.Components.map(async (comp) => {
          const fileUrl = new URL(comp, cc.Root);

          console.log(fileUrl);

          const fileFetch = await fetch(fileUrl);

          return fileFetch.text();
        }),
      );
    }

    return prev;
  }, [] as Promise<string>[]);

  const fileContents = await Promise.all(fileContentCalls);

  console.log(fileContents.join("\n\n"));

  await Deno.writeTextFile(
    "./build/tailwind-components.config",
    fileContents.join("\n\n"),
    {
      create: true,
    },
  );
}

export async function constructTailwindComponentsConfig(
  meta: ImportMeta,
  fileSrcs: FileListInput[],
  configs?: TailwindComponentsConfig[],
): Promise<void>;

export async function constructTailwindComponentsConfig(
  meta: ImportMeta,
  fileSrcs: FileListInput[],
  configs?: TailwindComponentsConfig[],
  fileName?: string,
): Promise<void>;

export async function constructTailwindComponentsConfig(
  meta: ImportMeta,
  fileSrcs: FileListInput[],
  configs?: TailwindComponentsConfig[],
  fileName?: string,
): Promise<void> {
  if (!fileName) {
    fileName = "./tailwind.components.ts";
  }

  const fileCalls = fileSrcs!.map((fs) => {
    return getFilesList(meta, fs);
  });

  const files = (await Promise.all(fileCalls)).flatMap((f) => f);

  const toBuildConfigs: TailwindComponentsConfig[] = [
    {
      Root: 'import.meta.resolve("./")',
      Components: files,
    },
    ...(configs || []).map((cfg) => ({
      Root: `'${cfg.Root}'`,
      Components: cfg.Components,
    })),
  ];

  const builtConfigs = toBuildConfigs.map(
    (tbc) =>
      `{
\t\tRoot: ${tbc.Root},
\t\tComponents: [\n\t\t\t"${tbc.Components.join('",\n\t\t\t"')}",\n\t\t],
\t}`,
  );

  const config = `export default [\n\t${builtConfigs.join(",\n\t")},\n];`;

  await Deno.writeTextFile(fileName, config, {
    create: true,
  });
}
