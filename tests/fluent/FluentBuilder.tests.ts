import type { IsObjectNotNative } from '../../src/common/types/IsObjectNotNative.ts';
import {
  type $FluentTag,
  type $FluentTagExtractValue,
  fluentBuilder,
} from '../../src/fluent/.exports.ts';
import type { FluentBuilderMethodsHandlers } from '../../src/fluent/types/FluentBuilderMethodsHandlers.ts';
import { assert, assertEquals, assertFalse } from '../test.deps.ts';

Deno.test('Fluent Builder Tests', async (t) => {
  await t.step('Starter Tests', async (t) => {
    await t.step('Basic Tests', async (t) => {
      await t.step('Object with Property', () => {
        const bldr = fluentBuilder<{ Hello: string }>().Root();

        const hello = bldr.Hello;

        const value = hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');
      });
    });

    await t.step('Various Initialization Tests', async (t) => {
      await t.step('Record of Native', () => {
        const bldr = fluentBuilder<Record<string, string>>();

        const key = bldr._Root('key');

        const record = key('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key, 'value');

        value = record.Export();

        assert(value);
        assertEquals(value.key, 'value');
      });

      await t.step('Object of Record of Native', () => {
        const bldr = fluentBuilder<{ test: Record<string, string> }>().Root();

        const testKey = bldr._test('key');

        const record = testKey('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key, 'value');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key, 'value');
      });

      await t.step('Record of Object', () => {
        const bldr =
          fluentBuilder<Record<string, { Hello: string; There: boolean }>>();

        const record = bldr._Root('key').Hello('World').There(true);

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key.Hello, 'World');

        value = record.Export();

        assert(value);
        assertEquals(value.key.Hello, 'World');
      });

      await t.step('Object of Record of Object', () => {
        const bldr = fluentBuilder<{
          test: Record<string, { Hello: string }>;
        }>().Root();

        const record = bldr._test('key').Hello('World');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key.Hello, 'World');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key.Hello, 'World');
      });

      await t.step('Record of Record of Native', () => {
        const bldr = fluentBuilder<Record<string, Record<string, string>>>();

        const rootKey = bldr._Root('key');

        const record = rootKey('subKey')('value');

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
        }>().Root();

        const record = bldr._test('key')('subKey')('value');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.test.key.subKey, 'value');

        value = record.Export();

        assert(value);
        assertEquals(value.test.key.subKey, 'value');
      });

      await t.step('Record of Record of Object', () => {
        const bldr =
          fluentBuilder<
            Record<string, Record<string, { Hello: string }>>
          >().Root();

        const record = bldr('key')('subKey').Hello('World');

        let value = bldr.Export();

        assert(value);
        assertEquals(value.key.subKey.Hello, 'World');

        value = record.Export();

        assert(value);
        assertEquals(value.key.subKey.Hello, 'World');
      });

      await t.step('Object of Record of Record of Object', () => {
        const bldr = fluentBuilder<{
          test: Record<string, Record<string, { Hello: string }>>;
        }>().Root();

        const record = bldr._test('key')('subKey').Hello('World');

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
            { generic: true; handlers: { Compile: (test: string) => string } }
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
      };

      const handlers: FluentBuilderMethodsHandlers = {
        Compile: (name: string) => `Hey ${name}`,
      };

      await t.step('Object with Property', () => {
        const bldr = fluentBuilder<fluentTest>().Root();

        const value = bldr.Hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');
      });

      await t.step('Nested Object as Property', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const nestBldr = bldr.NestedProp<expandedBase>({
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
        const bldr = fluentBuilder<fluentTest>().Root();

        bldr.Hello('World');

        bldr.Nested().Goodbye('Friend');

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Nested.Goodbye, 'Friend');

        const partial = bldr.Nested().Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.Nested.Goodbye, 'Friend');
      });

      await t.step('Nested Record as Property', () => {
        type t = $FluentTagExtractValue<
          fluentTest['NestedRecordGeneric'],
          'Methods',
          'generic'
        >;

        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const config = bldr._NestedRecordGeneric<expandedBase>;

        const nested = config('TestKey');

        nested.Speak('Something').Hello('World');

        config.$Elevated(['this-is-a-test']);

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
        const bldr = fluentBuilder<fluentTest>().Root();

        bldr.Hello('World');

        bldr._NestedRecord('TestKey').BringIt(true);

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assert(whole.NestedRecord['TestKey'].BringIt);
        assertFalse(whole.NestedRecord['@Methods']);

        const partial: fluentTest = bldr._NestedRecord('TestKey').Export();

        assert(partial);
        assertFalse(partial.Hello);
        assert(whole.NestedRecord['TestKey'].BringIt);
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        bldr
          ._NestedRecordGeneric<expandedBase>('TestKey')
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

        const partial = bldr
          ._NestedRecordGeneric<expandedBase>('TestKey')
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (partial.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const recBldr = bldr._NestedRecordGeneric<expandedBase>('TestKey');

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Double Nested Record', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const generic = bldr.Lowered()._Generic;

        generic('TestKey').Speak('Something');

        generic.$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');
        assert(whole.Lowered.Generic.$Elevated);
        assertEquals(whole.Lowered.Generic.$Elevated[0], 'this-is-a-test');

        const partial = bldr.Lowered()._Generic('TestKey').Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');

        const recBldr = bldr.Lowered()._Generic('TestKey');

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Possibly Undefined', () => {
        type t = $FluentTagExtractValue<
          fluentTest['NestedRecordGeneric'],
          'Methods',
          'generic'
        >;

        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const config = bldr._PossibleUndefined<expandedBase>;

        bldr._PossibleUndefined<expandedBase>('TestKey');

        const nested = config('TestKey');

        nested.Speak('Something').Hello('World');

        config.$Elevated(['this-is-a-test']);

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

      const handlers: FluentBuilderMethodsHandlers = {
        Compile: (name: string) => `Hey ${name}`,
      };

      await t.step('Object with Property', () => {
        const bldr = fluentBuilder<fluentTest>().Root();

        const value = bldr.Hello('World').Export();

        assert(value);
        assertEquals(value.Hello, 'World');
      });

      await t.step('Nested Object as Property', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const nestBldr = bldr.NestedProp<expandedBase>({
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
        const bldr = fluentBuilder<fluentTest>().Root();

        bldr.Hello('World');

        bldr.Nested().Goodbye('Friend');

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Nested.Goodbye, 'Friend');

        const partial = bldr.Nested().Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.Nested.Goodbye, 'Friend');
      });

      await t.step('Nested Record as Property', () => {
        type t = $FluentTagExtractValue<
          fluentTest['NestedRecordGeneric'],
          'Methods',
          'generic'
        >;

        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const config = bldr._NestedRecordGeneric<expandedBase>;

        const nested = config('TestKey');

        nested.Speak('Something').Hello('World');

        config.$Elevated(['this-is-a-test']);

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
        const bldr = fluentBuilder<fluentTest>().Root();

        bldr.Hello('World');

        bldr._NestedRecord('TestKey').BringIt(true);

        const whole: fluentTest = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assert(whole.NestedRecord['TestKey'].BringIt);
        assertFalse(whole.NestedRecord['@Methods']);

        const partial: fluentTest = bldr._NestedRecord('TestKey').Export();

        assert(partial);
        assertFalse(partial.Hello);
        assert(whole.NestedRecord['TestKey'].BringIt);
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        bldr
          ._NestedRecordGeneric<expandedBase>('TestKey')
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

        const partial = bldr
          ._NestedRecordGeneric<expandedBase>('TestKey')
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (partial.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const recBldr = bldr._NestedRecordGeneric<expandedBase>('TestKey');

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Double Nested Record', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        const generic = bldr.Lowered()._Generic;

        generic('TestKey').Speak('Something');

        generic.$Elevated(['this-is-a-test']);

        const whole = bldr.Export();

        assert(whole);
        assertEquals(whole.Hello, 'World');
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');
        assert(whole.Lowered.Generic.$Elevated);
        assertEquals(whole.Lowered.Generic.$Elevated[0], 'this-is-a-test');

        const partial = bldr.Lowered()._Generic('TestKey').Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(whole.Lowered.Generic['TestKey'].Speak, 'Something');

        const recBldr = bldr.Lowered()._Generic('TestKey');

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });

      await t.step('Nested Record as Property', () => {
        const bldr = fluentBuilder<fluentTest>(undefined, handlers).Root();

        bldr.Hello('World');

        bldr
          ._NestedRecordGeneric<expandedBase>('TestKey')
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

        const partial = bldr
          ._NestedRecordGeneric<expandedBase>('TestKey')
          .Export();

        assert(partial);
        assertFalse(partial.Hello);
        assertEquals(partial.NestedRecordGeneric['TestKey'].Speak, 'Something');
        assertEquals(
          (partial.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
          'World'
        );

        const recBldr = bldr._NestedRecordGeneric<expandedBase>('TestKey');

        assert(recBldr);
        assert(recBldr.Compile);
        assertEquals(recBldr.Compile('Mike'), 'Hey Mike');
      });
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

    type EaCObjectTags<T> = T & {
      [K in keyof T]: EverythingAsCodeTags<T[K]>;
    } & $FluentTag<
        'Methods',
        never,
        'handlers',
        {
          handlers: {
            Compile: () => unknown;
          };
        }
      >;

    await t.step('Handlers Test', () => {
      const eac =
        fluentBuilder<EverythingAsCodeTags<EverythingAsCode>>().Root();

      eac._Handlers.$Force(true);

      eac._Handlers('TestKey').APIPath('api/v1').Order(10);

      const whole = eac.Export();

      assert(whole);
      assertEquals(whole.Handlers!.$Force, true);
      assertEquals(whole.Handlers!['TestKey'].APIPath, 'api/v1');
      assertEquals(whole.Handlers!['TestKey'].Order, 10);

      const partial = eac._Handlers('TestKey').Export();

      assert(partial);
      assertFalse(partial.Handlers!.$Force);
      assertFalse(partial.Handlers!.$Force);
      assertEquals(partial.Handlers!['TestKey'].APIPath, 'api/v1');
      assertEquals(partial.Handlers!['TestKey'].Order, 10);

      const handlerBldr = eac._Handlers('TestKey');

      assert(handlerBldr);
      assert(handlerBldr.Compile);
      // assertEquals(handlerBldr.Compile('Mike'), 'Hey Mike!');
    });
  });
});
