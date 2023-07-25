import { build, emptyDir } from "$dnt";

await emptyDir("./build");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./build",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
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
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "build/LICENSE");
    Deno.copyFileSync("README.md", "build/README.md");
  },
});
