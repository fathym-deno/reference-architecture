import { z } from 'zod';
import { Command, CommandModule, CommandParams } from '@fathym/common/cli';

// 🔹 Define Zod schema for the fully-resolved, public CLI interface
export const DevParamsSchema = z.object({
  Verbose: z.boolean().optional().describe('Enable verbose logging'),
  Docker: z.boolean().optional().describe('Run in Docker'),
  Workspace: z.string().default('default').describe('Target workspace'),
});

// 🔹 This type represents fully computed command parameters
export type DevParamsSchema = z.infer<typeof DevParamsSchema>;

// 🔹 Classic flags and args (used internally, if needed)
type DevFlags = {
  Verbose?: boolean;
  Docker?: boolean;
  'dry-run'?: boolean;
};

type DevArgs = [Workspace?: string];

// 🔹 CLI metadata — optionally overridable, but can also be derived
export const Metadata = {
  Name: 'dev',
  Description: 'Run Open Industrial in dev mode',
  Usage: 'oi dev [workspace] [--Verbose] [--Docker]',
};

// 🔹 Fully resolved param object — hydrated using DevParamsSchema
export class DevCommandParams
  extends CommandParams<DevFlags, DevArgs>
  implements DevParamsSchema
{
  public static Schema = DevParamsSchema;

  public get Verbose(): boolean {
    return !!this.Flag('Verbose');
  }

  public get Docker(): boolean {
    return !!this.Flag('Docker');
  }

  public get Workspace(): string {
    return this.Arg(0) ?? 'default';
  }

  public ToResolved(): DevParamsSchema {
    return DevParamsSchema.parse({
      Verbose: this.Verbose,
      Docker: this.Docker,
      Workspace: this.Workspace,
    });
  }
}

// 🔹 The command class using resolved params
export class DevCommand implements Command {
  constructor(public Params: DevCommandParams) {}

  public Run(): void {
    const resolved = this.Params.ToResolved();

    if (resolved.Verbose) {
      console.log('📣 Verbose mode enabled');
    }

    console.log(`🔧 Running Open Industrial in dev mode...`);
    console.log(`📁 Workspace: ${resolved.Workspace}`);

    if (resolved.Docker) {
      console.log('🐳 Running in Docker...');
    } else {
      console.log('🧪 Running locally...');
    }
  }
}

export default {
  Command: DevCommand,
  Params: DevCommandParams,
} as CommandModule;
