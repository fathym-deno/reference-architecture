// deno-lint-ignore-file ban-types no-explicit-any
import { HasTypeCheck } from '../../src/common/types/HasTypeCheck.ts';
import { IsObjectNotNative } from '../../src/common/types/IsObjectNotNative.ts';
import {
  $FluentTagLoadHandlers,
  fluentBuilder,
  FluentBuilderMethodsHandlers,
} from '../../src/fluent/.exports.ts';
import type { $FluentTag } from '../../src/fluent/types/tags/$FluentTag.ts';
import { assert, assertEquals, assertFalse } from '../test.deps.ts';

Deno.test('Fluent Builder Tests', async (t) => {
  const handlers: FluentBuilderMethodsHandlers = {
    Compile: (_thisArg: any, name: string) => `Hey ${name}`,
  };

  type handlers = { Compile: (test: string) => string };

  await t.step('Starter Tests', async (t) => {
    await t.step('Basic Tests', async (t) => {
      await t.step('Primitives & Natives', async (t) => {
        await t.step('String', () => {
          const bldr = fluentBuilder<string>();

          const hello = bldr('Hello');

          let value = bldr.Export();

          assert(value);
          assertEquals(value, 'Hello');

          value = hello.Export();

          assert(value);
          assertEquals(value, 'Hello');

          bldr.With((b) => b('Hello2'));

          value = bldr.Export();

          assert(value);
          assertEquals(value, 'Hello2');
        });

        await t.step('Number', () => {
          const bldr = fluentBuilder<number>();

          const hello = bldr(41);

          let value = bldr.Export();

          assert(value);
          assertEquals(value, 41);

          value = hello.Export();

          assert(value);
          assertEquals(value, 41);

          bldr.With((b) => b(13));

          value = bldr.Export();

          assert(value);
          assertEquals(value, 13);
        });

        await t.step('Boolean', () => {
          const bldr = fluentBuilder<boolean>();

          const hello = bldr(true);

          let value = bldr.Export();

          assert(value);

          value = hello.Export();

          assert(value);

          bldr.With((b) => {
            b(false);
          });

          value = bldr.Export();

          assertFalse(value);
        });

        // await t.step('Multi Option', () => {
        //   const bldr = fluentBuilder<string | boolean | number>();

        //   const hello = bldr(true);

        //   let value = bldr.Export();

        //   assert(value);

        //   value = hello.Export();

        //   assert(value);

        //   bldr.With((b) => {
        //     b(false);
        //   });

        //   value = bldr.Export();

        //   assertFalse(value);
        // });
      });

      await t.step('Object with Property', () => {
        const bldr = fluentBuilder<{ Hello: string }>();

        const hello = bldr().Hello;

        let value = hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');

        bldr().With((b) => b.Hello('World2'));

        value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World2');
      });

      await t.step('Record of Primitive', () => {
        const bldr = fluentBuilder<Record<string | number, string>>();

        const hello = bldr('Hello', true);

        const value = hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');
      });
    });

    await t.step('Tests with Tags', async (t) => {
      await t.step('Primitive with Tags', async (t) => {
        await t.step('String as Property', () => {
          const bldr = fluentBuilder<
            string & $FluentTag<'Methods', 'Property'>
          >();

          const hello = bldr('Hello');

          let value = bldr.Export();

          assert(value);
          assertEquals(value, 'Hello');

          value = hello.Export();

          assert(value);
          assertEquals(value, 'Hello');

          bldr.With((b) => b('Hello2'));

          value = bldr.Export();

          assert(value);
          assertEquals(value, 'Hello2');
        });

        await t.step('String with Handler', () => {
          const bldr = fluentBuilder<
            string &
              $FluentTag<
                'Methods',
                'Property',
                'handlers',
                { handlers: handlers }
              >
          >({ handlers });

          const hello = bldr('Hello');

          let value = bldr.Export();

          assert(value);
          assertEquals(value, 'Hello');

          value = hello.Export();

          assert(value);
          assertEquals(value, 'Hello');
          assert(bldr.Compile);
          assertEquals(bldr.Compile('Mike'), 'Hey Mike');

          bldr.With((b) => b('Hello2'));

          value = bldr.Export();

          assert(value);
          assertEquals(value, 'Hello2');
          assert(bldr.Compile);
          assertEquals(bldr.Compile('Mike'), 'Hey Mike');
        });

        await t.step('Boolean as Property', () => {
          const bldr = fluentBuilder<
            boolean & $FluentTag<'Methods', 'Property'>
          >();

          const hello = bldr(true);

          let value = bldr.Export();

          assert(value);

          value = hello.Export();

          assert(value);

          bldr.With((b) => {
            b(false);
          });

          value = bldr.Export();

          assertFalse(value);
        });

        await t.step('Boolean with Handler', () => {
          const bldr = fluentBuilder<
            boolean &
              $FluentTag<
                'Methods',
                'Property',
                'handlers',
                { handlers: handlers }
              >
          >({ handlers });

          const hello = bldr(true);

          let value = bldr.Export();

          assert(value);

          value = hello.Export();

          assert(value);
          assert(bldr.Compile);
          assertEquals(bldr.Compile('Mike'), 'Hey Mike');

          bldr.With((b) => {
            b(false);
          });

          value = bldr.Export();

          assertFalse(value);
          assert(bldr.Compile);
          assertEquals(bldr.Compile('Mike'), 'Hey Mike');
        });
      });

      await t.step('Object with Tags', async (t) => {
        await t.step('Object as Property Tag', () => {
          const bldr = fluentBuilder<
            { Hello: string } & $FluentTag<'Methods', 'Property'>
          >();

          const hello = bldr({ Hello: 'World' });

          let value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World');

          value = hello.Export();

          assert(value);
          assertEquals(value.Hello, 'World');

          bldr.With((b) => b({ Hello: 'World2' }));

          value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World2');
        });

        await t.step('Object as Object Tag', () => {
          const bldr = fluentBuilder<
            { Hello: string } & $FluentTag<'Methods', 'Object'>
          >();

          const hello = bldr().Hello('World');

          let value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World');

          value = hello.Export();

          assert(value);
          assertEquals(value.Hello, 'World');

          bldr.With((b) => b().Hello('World2'));

          value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World2');
        });

        await t.step('Object as Record Tag', () => {
          const bldr = fluentBuilder<{
            Hello: string;
            [lookup: string]: string;
          }>();

          const hello = bldr().Hello('World');

          bldr('Goodbye', true)('Friend');

          let value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World');
          assertEquals(value.Goodbye, 'Friend');

          value = hello.Export();

          assert(value);
          assertEquals(value.Hello, 'World');
          assertEquals(value.Goodbye, 'Friend');

          bldr.With((b) => {
            b().Hello('World2');

            b('Goodbye', true)('Buddy');
          });

          value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World2');
          assertEquals(value.Goodbye, 'Buddy');
        });

        // await t.step('Broken Needs Name', () => {
        //   const bldr = fluentBuilder<
        //     { Hello: string; [lookup: string]: string | boolean } & $FluentTag<
        //       'Methods',
        //       'Record'
        //     >
        //   >();

        //   const hello = bldr('Hello', true)();

        //   bldr('Goodbye', true)('Friend');

        //   let value = bldr.Export();

        //   assert(value);
        //   assertEquals(value.Hello, 'World');
        //   assertEquals(value.Goodbye, 'Friend');

        //   value = hello.Export();

        //   assert(value);
        //   assertEquals(value.Hello, 'World');
        //   assertEquals(value.Goodbye, 'Friend');

        //   bldr.With((b) => {
        //     b().Hello('World2');

        //     b('Goodbye', true)('Buddy');
        //   });

        //   value = bldr.Export();

        //   assert(value);
        //   assertEquals(value.Hello, 'World2');
        //   assertEquals(value.Goodbye, 'Buddy');
        // });

        await t.step('Object with Handlers', () => {
          const bldr = fluentBuilder<
            { Hello: string } & $FluentTag<
              'Methods',
              never,
              'handlers',
              { handlers: handlers }
            >
          >({ handlers });

          const hello = bldr().Hello('World');

          let value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World');

          value = hello.Export();

          assert(value);
          assertEquals(value.Hello, 'World');
          assert(bldr.Compile);
          assertEquals(bldr.Compile('Mike'), 'Hey Mike');

          bldr.With((b) => b().Hello('World2'));

          value = bldr.Export();

          assert(value);
          assertEquals(value.Hello, 'World2');
          assert(bldr.Compile);
          assertEquals(bldr.Compile('Mike'), 'Hey Mike');
        });
      });

      await t.step('Record as Property Tag', () => {
        const bldr = fluentBuilder<
          Record<string, string> & $FluentTag<'Methods', 'Property'>
        >();

        const hello = bldr({ Hello: 'World', Goodbye: 'Now' });

        let value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assertEquals(value.Goodbye, 'Now');

        value = hello.Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assertEquals(value.Goodbye, 'Now');

        bldr.With((b) => b({ Hello: 'World2' }));

        value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World2');
        assertFalse(value.Goodbye);
      });
    });

    await t.step('Tests with Generic', async (t) => {
      await t.step('Object as Property with Generic', () => {
        type baseType = { Hello: string };

        type expandedtype = { Goodbye?: string } & baseType;

        const bldr = fluentBuilder<
          baseType &
            $FluentTag<'Methods', 'Property', 'generic', { generic: true }>
        >();

        const hello = bldr<expandedtype>;

        hello({ Hello: 'World', Goodbye: 'Now' });

        let value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assertEquals((value as expandedtype).Goodbye, 'Now');

        value = hello.Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assertEquals((value as expandedtype).Goodbye, 'Now');

        hello.With((b) => b({ Hello: 'World2' }));

        value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World2');
        assertFalse((value as expandedtype).Goodbye);
      });

      await t.step('Record as Property Tag', () => {
        type baseType = Record<string, unknown>;

        type expandedType = { BringIt: boolean } & baseType;

        const bldr = fluentBuilder<
          baseType &
            $FluentTag<'Methods', 'Property', 'generic', { generic: true }>
        >();

        const hello = bldr<expandedType>;

        hello({ Hello: 'World', Goodbye: 'Now', BringIt: true });

        let value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assertEquals(value.Goodbye, 'Now');
        assert((value as expandedType).BringIt);

        value = hello.Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assertEquals(value.Goodbye, 'Now');
        assert((value as expandedType).BringIt);

        hello.With((b) => b({ Hello: 'World2', BringIt: false }));

        value = bldr.Export();

        assert(value);
        assertEquals(value.Hello, 'World2');
        assertFalse(value.Goodbye);
        assertFalse((value as expandedType).BringIt);
      });
    });

    await t.step('Various Initialization Tests', async (t) => {
      await t.step('Record of Native', () => {
        const bldr = fluentBuilder<Record<string, string>>();

        const key = bldr('key', true);

        const record = key('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key, 'value');

        key.With((k) => {
          k('value2');
        });

        value = record.Export();

        assert(value);
        assertEquals(value.key, 'value2');
      });

      await t.step('Object of Record of Native', () => {
        const bldr = fluentBuilder<{ test: Record<string, string> }>();

        const testKey = bldr().test('key', true);

        const record = testKey('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key, 'value');

        testKey('value2');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key, 'value2');
      });

      await t.step('Record of Object', () => {
        const bldr =
          fluentBuilder<
            Record<string, { Hello: string; There: boolean; Here: number }>
          >();

        const key = bldr('key', true);

        const record = key.Hello('World').There(true).Here(41);

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key.Hello, 'World');
        assert(value.key.There);
        assertEquals(value.key.Here, 41);

        key.With((k) => {
          k.Hello('World2');

          k.There(false);

          k.Here(13);
        });

        value = record.Export();

        assert(value);
        assertEquals(value.key.Hello, 'World2');
        assertFalse(value.key.There);
        assertEquals(value.key.Here, 13);
      });

      await t.step('Object of Record of Object', () => {
        const bldr = fluentBuilder<{
          test: Record<string, { Hello: string }>;
        }>();

        const record = bldr().test('key', true).Hello('World');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key.Hello, 'World');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key.Hello, 'World');
      });

      await t.step('Record of Record of Native', () => {
        const bldr = fluentBuilder<Record<string, Record<string, string>>>();

        const rootKey = bldr('key', true);

        const subKey = rootKey('subKey', true);

        const record = subKey('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key.subKey, 'value');

        value = record.Export();

        assert(value);
        assertEquals(value.key.subKey, 'value');
      });

      await t.step('Object of Record of Record of Native', () => {
        const bldr = fluentBuilder<{
          test: Record<string, Record<string, string>>;
        }>();

        const record = bldr().test('key', true)('subKey', true)('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key.subKey, 'value');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key.subKey, 'value');
      });

      await t.step('Record of Record of Object', () => {
        const bldr =
          fluentBuilder<Record<string, Record<string, { Hello: string }>>>();

        const root = bldr('key', true);

        const sub = root('subKey', true);

        const record = sub.Hello('World');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key.subKey.Hello, 'World');

        value = record.Export();

        assert(value);
        assertEquals(value.key.subKey.Hello, 'World');
      });

      await t.step('Object of Record of Record of Object', () => {
        const bldr = fluentBuilder<{
          test: Record<
            string,
            Record<string, { Hello: string; BringIt: boolean }>
          >;
        }>();

        const record = bldr()
          .test('key', true)('subKey', true)
          .Hello('World')
          .BringIt(true);

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key.subKey.Hello, 'World');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key.subKey.Hello, 'World');
      });
    });

    await t.step('Basic', async (t) => {
      type tempBase = { Speak: string };

      type expandedBase = { Hello: string } & tempBase;

      type fluentTest = {
        Hello: string;
        Nested: {
          Goodbye: string;
        };
        NestedProp: tempBase &
          $FluentTag<
            'Methods',
            'Property',
            'generic' | 'handlers',
            { generic: true; handlers: handlers }
          >;
        NestedRecord: Record<
          string,
          {
            BringIt: boolean;
          }
        >;
        NestedRecordGeneric: Record<string, tempBase> & {
          $Elevated: string[];
        } & $FluentTag<
            'Methods',
            never,
            'generic' | 'handlers',
            { generic: true; handlers: { Compile: (test: string) => string } }
          >;
        Lowered: {
          Generic: Record<string, tempBase> & {
            $Elevated: string[];
          } & $FluentTag<
              'Methods',
              never,
              'generic' | 'handlers',
              { generic: true; handlers: { Compile: (test: string) => string } }
            >;
        };
        PossibleUndefined?: Record<string, tempBase> & {
          $Elevated: string[];
        } & $FluentTag<
            'Methods',
            never,
            'generic' | 'handlers',
            { generic: true; handlers: { Compile: (test: string) => string } }
          >;
      } & $FluentTag<
      'Methods',
      never,
       'handlers',
      { handlers: { Compile: (test: string) => string } }
    >;

      await t.step('Object with Property', () => {
        const bldr = fluentBuilder<fluentTest>();

        const value = bldr().Hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');
        assert(bldr.Compile);
        assertEquals(bldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Object as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        type x = $FluentTagLoadHandlers<fluentTest['NestedProp']>;

        bldr().Hello('World');

        const nestBldr = bldr().NestedProp<expandedBase>({
          Speak: 'Something',
          Hello: 'World',
        });

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.NestedProp.Speak, 'Something');
        assertEquals((whole.NestedProp as expandedBase).Hello, 'World');
        assert(bldr().NestedProp.Compile);
        assertEquals(bldr().NestedProp.Compile('Mike'), 'Hey Mike');
        assert(nestBldr.Compile);
        assertEquals(nestBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Object with Property', () => {
        const bldr = fluentBuilder<fluentTest>();

        bldr().Hello('World');

        bldr().Nested().Goodbye('Friend');

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Nested.Goodbye, 'Friend');

        const partial = bldr().Nested().Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.Nested.Goodbye, 'Friend');
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        const config = bldr().NestedRecordGeneric<expandedBase>;

        const nested = config('TestKey', true);

        nested.Speak('Something').Hello('World');

        config.$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assert(whole.NestedRecordGeneric.$Elevated);
        assertEquals(whole.NestedRecordGeneric.$Elevated[0], 'this-is-a-test');
        assertEquals(whole.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (whole.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );
        assert(nested.Compile);
        assertEquals(nested.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Record with Property', () => {
        const bldr = fluentBuilder<fluentTest>();

        bldr().Hello('World');

        bldr().NestedRecord('TestKey', true).BringIt(true);

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assert(whole.NestedRecord['TestKey'].BringIt);
        assertFalse(whole.NestedRecord['@Methods']);

        const partial: fluentTest = bldr()
          .NestedRecord('TestKey', true)
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assert(whole.NestedRecord['TestKey'].BringIt);
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        bldr()
          .NestedRecordGeneric<expandedBase>('TestKey', true)
          .Speak('Something')
          .Hello('World');

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (whole.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const partial = bldr()
          .NestedRecordGeneric<expandedBase>('TestKey', true)
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (partial.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const recBldr = bldr().NestedRecordGeneric<expandedBase>(
          'TestKey',
          true
        );

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Double Nested Record', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        const generic = bldr().Lowered().Generic;

        generic('TestKey', true).Speak('Something');

        generic().$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');
        assert(whole.Lowered.Generic.$Elevated);
        assertEquals(whole.Lowered.Generic.$Elevated[0], 'this-is-a-test');

        const partial = bldr().Lowered().Generic('TestKey', true).Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');

        const recBldr = bldr().Lowered().Generic('TestKey', true);

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Possibly Undefined', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        const config = bldr().PossibleUndefined<expandedBase>;

        bldr().PossibleUndefined<expandedBase>('TestKey', true);

        const nested = config('TestKey', true);

        nested.Speak('Something').Hello('World');

        config().$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        // assert(whole.NestedRecordGeneric.$Elevated);
        // assertEquals(whole.NestedRecordGeneric.$Elevated[0], 'this-is-a-test');
        assertEquals(whole.PossibleUndefined!['TestKey'].Speak, 'Something');
        assertEquals(
          (whole.PossibleUndefined!['TestKey'] as expandedBase).Hello,
          'World'
        );
        assert(nested.Compile);
        assertEquals(nested.Compile('Mike'), 'Hey Mike');
      });
    });

    await t.step('Additive Tags', async (t) => {
      type tempBase = { Speak: string };

      type expandedBase = { Hello: string } & tempBase;

      type fluentTestBase = {
        Hello: string;
        Nested: {
          Goodbye: string;
        };
        NestedProp: tempBase;
        NestedRecord: Record<
          string,
          {
            BringIt: boolean;
          }
        >;
        NestedRecordGeneric: Record<string, tempBase> & {
          $Elevated: string[];
        };
        Lowered: {
          Generic: Record<string, tempBase> & {
            $Elevated: string[];
          };
        };
      };

      type fluentTestTags = {
        NestedProp: $FluentTag<
          'Methods',
          'Property',
          'generic' | 'handlers',
          { generic: true; handlers: { Compile: (test: string) => string } }
        >;
        NestedRecordGeneric: $FluentTag<
          'Methods',
          'Record',
          'generic' | 'handlers',
          { generic: true; handlers: { Compile: (test: string) => string } }
        >;
        Lowered: {
          Generic: $FluentTag<
            'Methods',
            'Record',
            'generic' | 'handlers',
            { generic: true; handlers: { Compile: (test: string) => string } }
          >;
        };
      };

      type fluentTest = fluentTestBase & fluentTestTags;

      type x = fluentTest['NestedProp'];

      await t.step('Object with Property', () => {
        const bldr = fluentBuilder<fluentTest>();

        const value = bldr().Hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');
      });

      await t.step('Nested Object as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        const nestBldr = bldr().NestedProp<expandedBase>({
          Speak: 'Something',
          Hello: 'World',
        });

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.NestedProp.Speak, 'Something');
        assertEquals((whole.NestedProp as expandedBase).Hello, 'World');
        assert(nestBldr.Compile);
        assertEquals(nestBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Object with Property', () => {
        const bldr = fluentBuilder<fluentTest>();

        bldr().Hello('World');

        bldr().Nested().Goodbye('Friend');

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Nested.Goodbye, 'Friend');

        const partial = bldr().Nested().Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.Nested.Goodbye, 'Friend');
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        const config = bldr().NestedRecordGeneric<expandedBase>;

        const nested = config('TestKey', true);

        nested.Speak('Something').Hello('World');

        config().$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        // assert(whole.NestedRecordGeneric.$Elevated);
        // assertEquals(whole.NestedRecordGeneric.$Elevated[0], 'this-is-a-test');
        assertEquals(whole.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (whole.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );
        assert(nested.Compile);
        assertEquals(nested.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Record with Property', () => {
        const bldr = fluentBuilder<fluentTest>();

        bldr().Hello('World');

        bldr().NestedRecord('TestKey', true).BringIt(true);

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assert(whole.NestedRecord['TestKey'].BringIt);
        assertFalse(whole.NestedRecord['@Methods']);

        const partial: fluentTest = bldr()
          .NestedRecord('TestKey', true)
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assert(whole.NestedRecord['TestKey'].BringIt);
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        bldr()
          .NestedRecordGeneric<expandedBase>('TestKey', true)
          .Speak('Something')
          .Hello('World');

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (whole.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const partial = bldr()
          .NestedRecordGeneric<expandedBase>('TestKey', true)
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (partial.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const recBldr = bldr().NestedRecordGeneric<expandedBase>(
          'TestKey',
          true
        );

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Double Nested Record', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        const generic = bldr().Lowered().Generic;

        generic('TestKey', true).Speak('Something');

        generic().$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');
        assert(whole.Lowered.Generic.$Elevated);
        assertEquals(whole.Lowered.Generic.$Elevated[0], 'this-is-a-test');

        const partial = bldr().Lowered().Generic('TestKey', true).Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');

        const recBldr = bldr().Lowered().Generic('TestKey', true);

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>({ handlers });

        bldr().Hello('World');

        bldr()
          .NestedRecordGeneric<expandedBase>('TestKey', true)
          .Speak('Something')
          .Hello('World');

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (whole.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const partial = bldr()
          .NestedRecordGeneric<expandedBase>('TestKey', true)
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (partial.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const recBldr = bldr().NestedRecordGeneric<expandedBase>(
          'TestKey',
          true
        );

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });
    });

    await t.step('Dynamic Tagging', async (t) => {
      type EaCModuleHandler = {
        APIPath: string;
        Order: number;
      };

      type EaCModuleHandlers = {
        $Force?: boolean;
      } & Record<string, EaCModuleHandler>;

      type EverythingAsCode = {
        EnterpriseLookup?: string;
        Handlers?: EaCModuleHandlers;
        ParentEnterpriseLookup?: string;
      }; // & EaCDetails<EaCEnterpriseDetails>;

      type EverythingAsCodeTags<T> = true extends IsObjectNotNative<T>
        ? EaCObjectTags<T>
        : T;

      type EaCObjectTags<T> = T &
        EaCStandardTags<T> &
        EaCVertexDetailsTags<T> &
        EaCAsCodeTags<T>;

      Improved handling of recursive tag types and union types
      type EaCStandardTags<T> = {
        [K in keyof T as K extends 'Details' ? never : K]: EverythingAsCodeTags<
          T[K]
        >;
      };

      Handles conditional logic with union types and nested properties
      type EaCVertexDetailsTags<T> = [
        HasTypeCheck<NonNullable<T>, EaCVertexDetails>
      ] extends [true]
        ? {
            [K in keyof T as K extends 'Details'
              ? K
              : never]: EverythingAsCodeTags<
              T[K] &
                $FluentTag<'Methods', 'Object', 'generic', { generic: true }>
            >;
          }
        : {};

      Tag handling for EaCDetails and nested structures
      type EaCAsCodeTags<T> = [
        HasTypeCheck<NonNullable<T>, EaCDetails<any>>
      ] extends [true]
        ? {
            [K in keyof T as K extends string
              ? K
              : never]: 'Details' extends keyof T[K]
              ? EverythingAsCodeTags<T[K] & $FluentTag<'Methods', 'Object'>>
              : {};
          }
        : {};

      type EaCMetadataBase =
        | Record<string | number | symbol, unknown>
        | undefined;
      type EaCDetails<TDetails extends EaCVertexDetails> = {
        Details?: TDetails;
      } & EaCMetadataBase;
      type EaCVertexDetails = {
        Description?: string;

        /** The name of the vertex. */
        Name?: string;
      } & EaCMetadataBase &
        $FluentTag<'Methods', 'Object', 'generic', { generic: true }>;

      Tag handling for EaCDetails and nested structures

      type EverythingAsCodeDatabases = {
        Databases?: Record<string, EaCDatabaseAsCode>;
      };

      type EaCDatabaseAsCode = EaCDetails<EaCDatabaseDetails>;

      type EaCDatabaseDetails<TType extends string = string> = {
        Type: TType;
      } & EaCVertexDetails;

      type EaCDenoKVDatabaseDetails = {
        BringIt: boolean;
      } & EaCDatabaseDetails<'DenoKV'>;

      type EverythingAsCodeSynapticTags<T> = true extends IsObjectNotNative<T>
        ? SynapticObjectTags<T>
        : T;

      type SynapticObjectTags<T> = T & SynapticStandardTags<T>;

      Improved handling of recursive tag types and union types
      type SynapticStandardTags<T> = {
        [K in keyof T]: EverythingAsCodeSynapticTags<T>;
      };
      & $FluentTag<
        'Methods',
        never,
        'handlers',
        {
          handlers: {
            Compile: (ioc?: IoCContainer, plugins?: EaCRuntimePlugin[]) => IoCContainer;
          };
        }
      >

      type EverythingAsCodeSynaptic = {
        Circuits?: {
          $handlers?: Array<string>;
          $neurons?: Record<string, EaCModuleHandler>;
          $remotes?: Record<string, string>;
        } & Record<string, EaCModuleHandler>;
      } & EverythingAsCode &
        EverythingAsCodeDatabases;

      await t.step('Database Details method test', () => {
        const bldr =
          fluentBuilder<
            EverythingAsCodeSynapticTags<
              EverythingAsCodeTags<EverythingAsCodeSynaptic>
            >
          >(); //EaCDatabaseAsCode //'thinky', true);

        // Set values in Databases Details
        const db = bldr().Databases('thinky', true);

        const databaseDetails = db
          .Details<EaCDenoKVDatabaseDetails>()
          .Name('Mike')
          .BringIt(true);

        bldr().Databases('eac', true).Details().Name('Pete');

        // Verify the exported state
        const exported = bldr.Export();

        assert(exported);
        assert(exported.Databases);
        assert(databaseDetails);
        assertEquals(exported.Databases!['thinky'].Details!.Name, 'Mike');
        assertEquals(
          (exported.Databases!['thinky'].Details as EaCDenoKVDatabaseDetails)
            .BringIt,
          true
        );
        assertEquals(exported.Databases!['eac'].Details!.Name, 'Pete');
      });

      await t.step('Handlers Test', () => {
        const eac = fluentBuilder<EverythingAsCodeTags<EverythingAsCode>>();
        eac().Handlers().$Force(true);

        eac().Handlers('TestKey', true).APIPath('api/v1').Order(10);

        const whole = eac.Export();

        assert(whole);
        assertEquals(whole.Handlers!.$Force, true);
        assertEquals(whole.Handlers!['TestKey'].APIPath, 'api/v1');
        assertEquals(whole.Handlers!['TestKey'].Order, 10);

        const partial = eac().Handlers('TestKey', true).Export();

        assert(partial);
        assertFalse(partial.Handlers!.$Force);
        assertFalse(partial.Handlers!.$Force);
        assertEquals(partial.Handlers!['TestKey'].APIPath, 'api/v1');
        assertEquals(partial.Handlers!['TestKey'].Order, 10);

        const handlerBldr = eac().Handlers('TestKey', true);

        assert(handlerBldr);
        // assert(handlerBldr.Compile);
        // assertEquals(handlerBldr.Compile('Mike'), 'Hey Mike!');
      });

      await t.step('Circuits from Synaptic Test', () => {
        const eacBldr =
          fluentBuilder<
            EverythingAsCodeSynapticTags<
              EverythingAsCodeTags<EverythingAsCodeSynaptic>
            >
          >();

        eacBldr().Circuits().$neurons('$pass', true);
      });
    });
  });
});
