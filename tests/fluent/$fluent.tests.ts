// deno-lint-ignore-file no-explicit-any
import type { $TagExtract } from '../../src/fluent/.deps.ts';
import type {
  $FluentTag,
  $FluentTagDataKeyOptions,
  $FluentTagDeepStrip,
  $FluentTagExists,
  $FluentTagExtract,
  $FluentTagExtractValue,
  $FluentTagExtractValues,
  $FluentTagOptions,
  $FluentTagStrip,
  $FluentTagTypeOptions,
  FluentMethodsObject,
  FluentMethodsProperty,
  FluentMethodsRecord,
  SelectFluentMethods,
} from '../../src/fluent/.exports.ts';
import { assert, assertEquals, assertFalse } from '../test.deps.ts';

Deno.test('$Fluent Tag Tests', async (t) => {
  await t.step('Type', async (t) => {
    await t.step('Tags', async (t) => {
      type tagFluent = $FluentTag<
        'Methods',
        'Property',
        'generic' | 'handlers',
        { generic: true; handlers: { Compile: () => {} } }
      >;

      await t.step('Fluent Tag Type Options', () => {
        type t = $FluentTagTypeOptions;

        const c: t = 'Methods';

        assert(c);
        assertEquals(c, 'Methods');
      });

      await t.step('Fluent Tag Options', () => {
        type t = $FluentTagOptions<'Methods'>;

        const c: t = 'Record';

        assert(c);
        assertEquals(c, 'Record');
      });

      await t.step('Fluent Tag Data Key Options', () => {
        type t = $FluentTagDataKeyOptions<'Methods'>;

        const c: t = 'generic';

        assert(c);
        assertEquals(c, 'generic');
      });

      await t.step('Tag Exists', () => {
        type tagWithRecord = Record<
          string,
          {
            Speak: string;
          }
        > &
          $FluentTag<'Methods', 'Record'>;

        type tagExists = {
          Type: $FluentTagExists<tagFluent, 'Methods'>;
          TypeTag: $FluentTagExists<tagFluent, 'Methods', 'Property'>;
          TypeTagValues: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            'generic'
          >;
          TypeTagValuesBoth: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            'generic' | 'handlers'
          >;
          WithRecord: $FluentTagExists<tagWithRecord, 'Methods', 'Record'>;
          BadType: $FluentTagExists<
            tagFluent,
            // @ts-ignore Allow setting a bad value to support test
            'Bad',
            'Property',
            'generic'
          >;
          BadTag: $FluentTagExists<
            tagFluent,
            'Methods',
            // @ts-ignore Allow setting a bad value to support test
            'Bad',
            'generic'
          >;
          BadTypeTag: $FluentTagExists<
            tagFluent,
            // @ts-ignore Allow setting a bad value to support test
            'Bad',
            'Bad',
            'trim'
          >;
          BadTypeTagValues: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            // @ts-ignore Allow setting a bad value to support test
            'Bad'
          >;
          BadTypeTagValuesBoth: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            // @ts-ignore Allow setting a bad value to support test
            'Bad' | 'Bad'
          >;
          BadTypeTagValuesPartial: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            // @ts-ignore Allow setting a bad value to support test
            'generic' | 'Bad'
          >;
          WrongTag: $FluentTagExists<tagFluent, 'Methods', 'Object'>;
        };

        const d: tagExists = {
          Type: true,
          TypeTag: true,
          TypeTagValues: true,
          TypeTagValuesBoth: true,
          WithRecord: true,
          BadType: false,
          BadTag: false,
          BadTypeTag: false,
          BadTypeTagValues: false,
          BadTypeTagValuesBoth: false,
          BadTypeTagValuesPartial: false,
          WrongTag: false,
        };

        assert(d);
        assert(d.Type);
        assert(d.TypeTag);
        assert(d.TypeTagValues);
        assert(d.TypeTagValuesBoth);
        assertFalse(d.BadType);
        assertFalse(d.BadTag);
        assertFalse(d.BadTypeTag);
        assertFalse(d.BadTypeTagValues);
        assertFalse(d.BadTypeTagValuesBoth);
        assertFalse(d.BadTypeTagValuesPartial);
        assertFalse(d.WrongTag);
      });

      await t.step('Tag Extracts', () => {
        type tagExtract = $FluentTagExtract<tagFluent, 'Methods'>;

        const tagged: tagExtract = 'Property';

        assert(tagged);
        assertEquals(tagged, 'Property');

        type tagValue = $FluentTagExtractValue<
          tagFluent,
          'Methods',
          tagExtract,
          'generic'
        >;

        const value: tagValue = true;

        assertEquals(value, true);

        type tagValues = $FluentTagExtractValues<
          tagFluent,
          'Methods',
          tagExtract,
          'generic' | 'handlers'
        >;

        const values: tagValues = {
          Methods: {
            generic: true,
            handlers: { Compile: () => ({}) },
          },
        };

        assert(values?.Methods?.['generic']);
        assert(values?.Methods?.['handlers']);
        assertEquals(values?.Methods?.['generic'], true);
        assert(values?.Methods?.['handlers']?.Compile);
      });

      await t.step('Tag Stripped', () => {
        type tagStripped1 = $FluentTagStrip<tagFluent, 'Methods'>;

        const stripped1: tagStripped1 = {};

        assert(stripped1);

        type tagStripped2 = $FluentTagStrip<
          tagFluent,
          'Methods',
          'Property',
          'handlers'
        >;

        const stripped2: tagStripped2 = {
          '@Methods': 'Property',
          '@Methods-generic': true,
        };

        assert(stripped2);
        assertEquals(stripped2['@Methods'], 'Property');
        // @ts-ignore Ignore missing property, to enforce assertion
        assertFalse(stripped2['@Methods-handlers']);
        assertEquals(stripped2['@Methods-generic'], true);

        type tagStripped3 = $FluentTagStrip<
          tagFluent,
          'Methods',
          'Property',
          'generic' | 'handlers'
        >;

        const stripped3: tagStripped3 = {
          '@Methods': 'Property',
        };

        assert(stripped3);
        assertEquals(stripped3['@Methods'], 'Property');
        // @ts-ignore Ignore missing property, to enforce assertion
        assertFalse(stripped3['@Methods-trim']);
        // @ts-ignore Ignore missing property, to enforce assertion
        assertFalse(stripped3['@Methods-value']);

        type tagStripped4 = $FluentTagStrip<
          tagFluent,
          'Methods',
          'Property',
          never,
          true
        >;

        const stripped4: tagStripped4 = {
          '@Methods-generic': true,
          '@Methods-handlers': { Compile: () => ({}) },
        };

        assert(stripped4);
        // @ts-ignore Ignore missing property, to enforce assertion
        assertFalse(stripped4['@Methods']);
        assertEquals(stripped4['@Methods-generic'], true);
        assert(stripped4['@Methods-handlers']?.Compile);
      });

      await t.step('Tag Stripped - No Metadata - Record', () => {
        type tagWithRecord = Record<
          string,
          {
            Speak: string;
          }
        > &
          $FluentTag<'Methods', 'Record'>;

        type tagStripped1 = $FluentTagStrip<tagWithRecord, 'Methods'>;

        type tagExists = $FluentTagExists<tagStripped1, 'Methods'>;

        type tagKeys = $TagExtract<tagStripped1, 'Methods'>;

        let _keysCheck: tagKeys;

        // assert(keysCheck);

        const stripped1: tagStripped1 = {};

        assert(stripped1);
      });

      await t.step('Tag Deep Stripped', () => {
        type fluentTest = {
          Hello: string;
          Nested: {
            Goodbye: string;
          };
          NestedProp: {
            Speak: string;
          } & $FluentTag<'Methods', 'Property'>;
          NestedRecord: Record<
            string,
            {
              BringIt: boolean;
            }
          >;
        };

        type tagStripped1 = $FluentTagDeepStrip<fluentTest, 'Methods'>;

        type record = $FluentTagStrip<tagStripped1['NestedRecord']>;

        const stripped1: record = { '': { BringIt: true } };

        assert(stripped1);

        // type tagStripped2 = $FluentTagDeepStrip<
        //   fluentTest,
        //   'Methods',
        //   'Property' | 'Record'
        // >;

        // const stripped2: tagStripped2 = {
        //   NestedRecord: {

        //   }
        // };

        // assert(stripped2);
        // assert(stripped2.Bucket[''].BringIt);
      });
    });

    await t.step('Fluent', async (t) => {
      await t.step('Methods', async (t) => {
        type fluentTest = {
          Hello: string;
          Nested: {
            Goodbye: string;
          };
          Record: Record<
            string,
            {
              Speak: string;
            }
          > &
            $FluentTag<'Methods', 'Record'>;
        };

        await t.step('Types', async (t) => {
          await t.step('Object', () => {
            type fluentMethods = FluentMethodsObject<
              fluentTest,
              'Nested',
              fluentTest
            >;

            const check: fluentMethods = () => {
              return {} as any;
            };

            const next = check();

            assert(next);
          });

          await t.step('Property', () => {
            type fluentMethods = FluentMethodsProperty<
              fluentTest,
              'Hello',
              fluentTest
            >;

            const check: fluentMethods = (input) => {
              return input as any;
            };

            const next = check('Hello');

            assert(next);
            assertEquals<any>(next, 'Hello');
          });

          await t.step('Property Nested', () => {
            type fluentMethods = FluentMethodsProperty<
              fluentTest['Nested'],
              'Goodbye',
              fluentTest
            >;

            const check: fluentMethods = (input) => {
              return input as any;
            };

            const next = check('Friend');

            assert(next);
            assertEquals<any>(next, 'Friend');
          });

          await t.step('Object as Property', () => {
            type fluentMethods = FluentMethodsProperty<
              fluentTest,
              'Nested',
              fluentTest
            >;

            const check: fluentMethods = (input) => {
              return input as any;
            };

            const next = check({
              Goodbye: 'Friend',
            });

            assert(next);
            assertEquals<any>((next as any).Goodbye, 'Friend');
          });

          await t.step('Object as Record', () => {
            type fluentMethods = FluentMethodsRecord<
              fluentTest,
              'Record',
              fluentTest
            >;

            const check: fluentMethods = (_input) => {
              return {
                Speak: (input: string) => {
                  return input as any;
                },
              } as any;
            };

            const next = check('recordKey').Speak('Hello');

            assert(next);
            assertEquals<any>(next, 'Hello');
          });
        });

        await t.step('Select', async (t) => {
          await t.step('Object', () => {
            type fluentObjectMethods = SelectFluentMethods<
              fluentTest['Nested'],
              fluentTest
            >;

            const objectMethods: fluentObjectMethods = {
              Goodbye: (value: string) => {
                return value as any;
              },
            };

            const friend = objectMethods.Goodbye('Friend');

            assert(friend);
            assertEquals<any>('Friend', friend);
          });

          await t.step('Property', () => {
            type fluentPropertyMethods = SelectFluentMethods<
              { Bucket: fluentTest['Hello'] },
              fluentTest
            >;

            const propertyMethods: fluentPropertyMethods['Bucket'] = (
              value: string
            ) => {
              return value as any;
            };

            const hello = propertyMethods('World');

            assert(hello);
            assertEquals<any>('World', hello);
          });

          await t.step('Record', () => {
            type exists = $FluentTagExists<
              fluentTest['Record'],
              'Methods',
              'Record'
            >;

            type extracted = $FluentTagExtract<fluentTest['Record'], 'Methods'>;

            type extractedCheck = extracted extends 'Record' ? true : false;

            const check: extractedCheck = true;

            assert(check);

            type fluentPropertyMethods = SelectFluentMethods<
              { Bucket: fluentTest['Record'] },
              fluentTest
            >;

            const recordMethods: fluentPropertyMethods['_Bucket'] = (
              _key: string
            ) => {
              return {
                Speak: (input: string) => {
                  return input as any;
                },
              } as any;
            };

            const bldr = recordMethods('NewKey').Speak('Something');

            assert(bldr);
            assertEquals<any>(bldr, 'Something');
          });

          await t.step('Full', () => {
            type fluentMethods = SelectFluentMethods<fluentTest, fluentTest>;
          });
        });
      });
    });
  });
});
