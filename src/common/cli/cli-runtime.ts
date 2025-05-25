import { CLI } from "./CLI.ts";

const cli = new CLI();

await cli.RunFromConfig(Deno.args[0], Deno.args.slice(1));
