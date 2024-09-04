// deno-lint-ignore-file no-explicit-any
import {
  $TagExists,
  ExcludeKeysByPrefix,
  NoPropertiesUndefined,
  ValueType,
} from '../../src/fluent/.deps.ts';
import {
  DetermineEaCFluentMethods,
  DetermineFluentMethodsType,
  fluentBuilder,
  FluentMethodsMap,
  FluentMethodsObject,
  FluentMethodsProperty,
  FluentMethodsRecord,
  SelectFluentMethods,
  type $FluentTag,
  type $FluentTagDataKeyOptions,
  type $FluentTagExists,
  type $FluentTagExtract,
  type $FluentTagExtractValue,
  type $FluentTagExtractValues,
  type $FluentTagOptions,
  type $FluentTagStrip,
  type $FluentTagTypeOptions,
} from '../../src/fluent/.exports.ts';
import { assert, assertEquals, assertFalse } from '../test.deps.ts';

Deno.test('$Fluent Tag Tests', async (t) => {
  await t.step('Type', async (t) => {
    await t.step('Tags', async (t) => {
      type tagFluent = $FluentTag<
        'Methods',
        'Property',
        '...' | '......',
        { '...': 'true'; '......': 'false' }
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

        const c: t = '...';

        assert(c);
        assertEquals(c, '...');
      });

      await t.step('Tag Exists', () => {
        type tagExists = {
          Type: $FluentTagExists<tagFluent, 'Methods'>;
          TypeTag: $FluentTagExists<tagFluent, 'Methods', 'Property'>;
          TypeTagValues: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            '...'
          >;
          TypeTagValuesBoth: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            '...' | '......'
          >;
          TypeTagValuesPartial: $FluentTagExists<
            tagFluent,
            'Methods',
            'Property',
            // @ts-ignore Allow setting a bad value to support test
            '...' | 'Bad'
          >;
          BadType: $FluentTagExists<
            tagFluent,
            // @ts-ignore Allow setting a bad value to support test
            'Bad',
            'Property',
            '...'
          >;
          BadTag: $FluentTagExists<
            tagFluent,
            'Methods',
            // @ts-ignore Allow setting a bad value to support test
            'Bad',
            '...'
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
          WrongTag: $FluentTagExists<tagFluent, 'Methods', 'Object'>;
        };

        const d: tagExists = {
          Type: true,
          TypeTag: true,
          TypeTagValues: true,
          TypeTagValuesBoth: true,
          TypeTagValuesPartial: true,
          BadType: false,
          BadTag: false,
          BadTypeTag: false,
          BadTypeTagValues: false,
          BadTypeTagValuesBoth: false,
          WrongTag: false,
        };

        assert(d);
        assert(d.Type);
        assert(d.TypeTag);
        assert(d.TypeTagValues);
        assert(d.TypeTagValuesBoth);
        assert(d.TypeTagValuesPartial);
        assertFalse(d.BadType);
        assertFalse(d.BadTag);
        assertFalse(d.BadTypeTag);
        assertFalse(d.BadTypeTagValues);
        assertFalse(d.BadTypeTagValuesBoth);
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
          '...'
        >;

        const value: tagValue = 'true';

        assertEquals(value, 'true');

        type tagValues = $FluentTagExtractValues<
          tagFluent,
          'Methods',
          tagExtract,
          '...' | '......'
        >;

        const values: tagValues = {
          Methods: {
            '...': 'true',
            '......': 'false',
          },
        };

        assert(values?.Methods?.['...']);
        assert(values?.Methods?.['......']);
        assertEquals(values?.Methods?.['...'], 'true');
        assertEquals(values?.Methods?.['......'], 'false');
      });

      await t.step('Tag Stripped', () => {
        type tagStripped1 = $FluentTagStrip<tagFluent, 'Methods'>;

        const stripped1: tagStripped1 = {};

        assert(stripped1);

        type tagStripped2 = $FluentTagStrip<
          tagFluent,
          'Methods',
          'Property',
          '......'
        >;

        const stripped2: tagStripped2 = {
          '@Methods': 'Property',
          '@Methods-...': 'true',
        };

        assert(stripped2);
        assertEquals(stripped2['@Methods'], 'Property');
        // @ts-ignore Ignore missing property, to enforce assertion
        assertFalse(stripped2['@Methods-......']);
        assertEquals(stripped2['@Methods-...'], 'true');

        type tagStripped3 = $FluentTagStrip<
          tagFluent,
          'Methods',
          'Property',
          '...' | '......'
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
          '@Methods-...': 'true',
          '@Methods-......': 'false',
        };

        assert(stripped4);
        // @ts-ignore Ignore missing property, to enforce assertion
        assertFalse(stripped4['@Methods']);
        assertEquals(stripped4['@Methods-...'], 'true');
        assertEquals(stripped4['@Methods-......'], 'false');
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
              return {} as any;
            };

            const next = check('recordKey').Speak('Hello');

            assert(next);
            assertEquals<any>((next as any).Speak, 'You got it');
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

            const propertyMethods: fluentPropertyMethods['Bucket'] = (
              key: string
            ) => {
              return { key } as any;
            };

            const hello = propertyMethods('NewKey').Speak('');

            assert(hello);
            assertEquals<any>('World', hello);
          });

          await t.step('Full', () => {
            type fluentMethods = SelectFluentMethods<fluentTest, fluentTest>;
          });
        });
      });
    });
  });
});
