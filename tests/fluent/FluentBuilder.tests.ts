import {
  type $FluentTag,
  $FluentTagExtractValue,
  fluentBuilder,
} from '../../src/fluent/.exports.ts';
import { assert, assertEquals, assertFalse } from '../test.deps.ts';

Deno.test('Fluent Builder Tests', async (t) => {
  await t.step('Basic Tests', async (t) => {
    const bldr = fluentBuilder<{ Hello: string }>();

    await t.step('Object with Property', () => {
      const value = bldr.Hello('World').Export();

      assert(value);
      assertEquals(value.Hello, 'World');
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
        $FluentTag<'Methods', 'Property', 'generic', { generic: true }>;
      NestedRecord: Record<
        string,
        {
          BringIt: boolean;
        }
      >;
      NestedRecordGeneric: Record<string, tempBase> &
        $FluentTag<'Methods', 'Record', 'generic', { generic: true }>;
    };

    await t.step('Object with Property', () => {
      const bldr = fluentBuilder<fluentTest>();

      const value = bldr.Hello('World').Export();

      assert(value);
      assertEquals(value.Hello, 'World');
    });

    await t.step('Nested Object as Property', () => {
      const bldr = fluentBuilder<fluentTest>();

      bldr.Hello('World');

      bldr.NestedProp<expandedBase>({
        Speak: 'Something',
        Hello: 'World',
      });

      const whole = bldr.Export();

      assert(whole);
      assertEquals(whole.Hello, 'World');
      assertEquals(whole.NestedProp.Speak, 'Something');
      assertEquals((whole.NestedProp as expandedBase).Hello, 'World');
    });

    await t.step('Nested Object with Property', () => {
      const bldr = fluentBuilder<fluentTest>();

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
        'Record',
        'generic'
      >;

      const bldr = fluentBuilder<fluentTest>();

      bldr.Hello('World');

      type x = ReturnType<typeof bldr._NestedRecordGeneric<expandedBase>>;

      const speak = bldr
        ._NestedRecordGeneric<expandedBase>('TestKey')
        .Speak('Something')
        .Hello('World');

      const whole = bldr.Export();

      assert(whole);
      assertEquals(whole.Hello, 'World');
      assertEquals(whole.NestedRecordGeneric['TestKey'].Speak, 'Something');
      assertEquals(
        (whole.NestedRecordGeneric['TestKey'] as expandedBase).Hello,
        'World'
      );
    });

    await t.step('Nested Record with Property', () => {
      const bldr = fluentBuilder<fluentTest>();

      bldr.Hello('World');

      bldr._NestedRecord('TestKey').BringIt(true);

      const whole = bldr.Export();

      assert(whole);
      assertEquals(whole.Hello, 'World');
      assert(whole.NestedRecord['TestKey'].BringIt);
      assertFalse(whole.NestedRecord['@Methods']);

      const partial = bldr._NestedRecord('TestKey').Export();

      assert(partial);
      assertFalse(partial.Hello);
      assert(whole.NestedRecord['TestKey'].BringIt);
    });
  });
});
