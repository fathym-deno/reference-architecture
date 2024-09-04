import {
  $FluentTagExtract,
  fluentBuilder,
  SelectFluentMethods,
  type $FluentTag,
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
      > &
        $FluentTag<'Methods', 'Record'>;
    };

    const bldr = fluentBuilder<fluentTest>();

    await t.step('Object with Property', () => {
      const value = bldr.Hello('World').Export();

      assert(value);
      assertEquals(value.Hello, 'World');
    });

    await t.step('Nested Object with Property', () => {
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

    await t.step('Nested Record with Property', () => {
      bldr.Hello('World');

      bldr.NestedRecord({
        '': {
          BringIt: true,
        },
      });

      const whole = bldr.Export();

      assert(whole);
      assertEquals(whole.Hello, 'World');
      assertEquals(whole.Nested.Goodbye, 'Friend');

      const partial = bldr.Nested().Export();

      assert(partial);
      assertFalse(partial.Hello);
      assertEquals(partial.Nested.Goodbye, 'Friend');
    });
  });
});
