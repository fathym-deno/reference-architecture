import { CLI } from "./CLI.ts";

const cli = new CLI();

await cli.RunFromArgs(Deno.args);
