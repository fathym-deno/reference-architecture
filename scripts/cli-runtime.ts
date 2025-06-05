import { CLI } from "../src/common/cli/CLI.ts";

const cli = new CLI();

await cli.RunFromArgs(Deno.args);
