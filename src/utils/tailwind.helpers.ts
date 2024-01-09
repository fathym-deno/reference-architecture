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
  fileSrcs: FileListInput[],
): Promise<void>;

export async function constructTailwindComponentsConfig(
  fileSrcs: FileListInput[],
  fileName: string,
): Promise<void>;

export async function constructTailwindComponentsConfig(
  fileSrcs: FileListInput[],
  fileName = "./tailwind.components.ts",
): Promise<void> {
  const fileCalls = fileSrcs!.map((fs) => {
    return getFilesList(fs);
  });

  const files = (await Promise.all(fileCalls)).flatMap((f) => f);

  const tailwindComponentsConfig = `export default {
  \tRoot: import.meta.resolve("./"),
  \tComponents: [\n\t\t"${files.join('",\n\t\t"')}"\n\t],
  };`;

  await Deno.writeTextFile(fileName, tailwindComponentsConfig, {
    create: true,
  });
}
