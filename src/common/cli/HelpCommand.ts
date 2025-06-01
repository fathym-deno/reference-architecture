import { Command } from './commands/Command.ts';
import { z } from './.deps.ts';
import { HelpContextSchema, type HelpContext } from './HelpContext.ts';
import { CommandParams } from './commands/CommandParams.ts';

/**
 * Flag schema for HelpCommand — directly matches the HelpContext structure.
 */
export const HelpFlagsSchema = HelpContextSchema;

/**
 * HelpCommand takes no positional arguments.
 */
export const HelpArgsSchema = z.tuple([]);

/**
 * Parameters used by HelpCommand — surfaces structured HelpContext flags.
 */
export class HelpCommandParams extends CommandParams<
  z.infer<typeof HelpFlagsSchema>,
  z.infer<typeof HelpArgsSchema>
> {
  public get Header(): string | undefined {
    return this.Flag('Header');
  }

  public get Intro(): HelpContext['Intro'] {
    return this.Flag('Intro');
  }

  public get Sections(): HelpContext['Sections'] {
    return this.Flag('Sections');
  }
}

/**
 * Runtime implementation of the help renderer.
 */
export class HelpCommand extends Command<HelpCommandParams> {
  constructor(params: HelpCommandParams) {
    super(params, HelpArgsSchema, HelpFlagsSchema);
  }

  public async Run(): Promise<void> {
    const { Header, Intro, Sections } = this.Params;

    if (Header) {
      console.log(`\n🔹 ${Header}\n`);
    }

    if (Intro) {
      console.log(`📘 ${Intro.Name}`);
      if (Intro.Description) console.log(Intro.Description);
      if (Intro.Usage) console.log(`\nUsage:\n  ${Intro.Usage}`);
      if (Intro.Examples?.length) {
        console.log('\nExamples:');
        for (const ex of Intro.Examples) {
          console.log(`  ${ex}`);
        }
      }
      console.log('');
    }

    if (Sections?.length) {
      for (const section of Sections) {
        switch (section.type) {
          case 'CommandDetails': {
            console.log(`📘 ${section.Name}`);
            if (section.Description) console.log(section.Description);
            if (section.Usage) console.log(`\nUsage:\n  ${section.Usage}`);
            if (section.Examples?.length) {
              console.log('\nExamples:');
              for (const ex of section.Examples) {
                console.log(`  ${ex}`);
              }
            }
            console.log('');
            break;
          }

          case 'GroupDetails': {
            console.log(`📘 ${section.Name}`);
            if (section.Description) console.log(section.Description);
            if (section.Usage) console.log(`\nUsage:\n  ${section.Usage}`);
            if (section.Examples?.length) {
              console.log('\nExamples:');
              for (const ex of section.Examples) {
                console.log(`  ${ex}`);
              }
            }
            console.log('');
            break;
          }

          case 'CommandList':
          case 'GroupList': {
            console.log(`\n🔸 ${section.title}`);
            for (const item of section.items) {
              console.log(`  ${item.Name} - ${item.Description ?? ''}`);
            }
            break;
          }

          case 'Error': {
            console.error(`❌ ${section.message}`);
            if (section.suggestion) {
              console.log(`💡 Did you mean: ${section.suggestion}?`);
            }
            break;
          }
        }
      }
    }
  }

  public BuildMetadata() {
    return this.buildMetadataFromSchemas(
      'Help Command',
      'Display structured help context for commands and groups'
    );
  }
}
