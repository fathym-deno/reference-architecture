import {
  Command,
  CommandParams,
  defineCommandModule,
} from '@fathym/common/cli';
import { z } from '../../../../../../test.deps.ts';

// 🔹 Flag and argument schemas (placeholder for now)
export const FlagsSchema = z.object({});
export const ArgsSchema = z.tuple([]);

// 🔹 CLI params class with direct accessors (can grow later)
export class AzureCommandParams extends CommandParams<
  z.infer<typeof FlagsSchema>,
  z.infer<typeof ArgsSchema>
> {
  // Add getters here when flags/args grow
}

// 🔹 Command implementation — includes CLI lifecycle + metadata
export class AzureCommand extends Command<AzureCommandParams> {
  constructor(params: AzureCommandParams) {
    super(params, ArgsSchema, FlagsSchema);
  }

  public async Run(): Promise<void> {
    console.log('🔧 Scaffolding Azure...');
  }

  public BuildMetadata() {
    return this.buildMetadataFromSchemas(
      'Scaffold Azure',
      'Generate a new Azure file.'
    );
  }
}

// 🔹 Final CLI module export using the helper
export default defineCommandModule({
  FlagsSchema,
  ArgsSchema,
  Command: AzureCommand,
  Params: AzureCommandParams,
});
