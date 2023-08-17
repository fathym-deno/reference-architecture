import { build, emptyDir } from "$dnt";

await emptyDir("./build");

await build({
  entryPoints: ["./mod.ts", {
    name: "./eac",
    path: "./src/eac/_exports.ts",
  }],
  outDir: "./build",
  shims: {
    deno: true,
  },
  package: {
    name: "@fathym-deno/common",
    version: Deno.args[0],
    description: "Fathym's ES6 based common library.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/fathym-deno/reference-architecture.git",
    },
    bugs: {
      url: "https://github.com/fathym-deno/reference-architecture/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "build/LICENSE");
    Deno.copyFileSync("README.md", "build/README.md");
  },
});
