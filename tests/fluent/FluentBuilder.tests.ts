import {
  fluentBuilder,
  type $FluentTag,
} from '../../src/fluent/.exports.ts';
import { assert, assertEquals } from '../test.deps.ts';

Deno.test('$Fluent Tag Tests', async (t) => {
  await t.step('Basic Tests', async (t) => {
    const bldr = fluentBuilder<{ Hello: string }>();

    await t.step('Object with Property', () => {
      const value = bldr.Hello('World').Export();

      assert(value);
      assertEquals(value.Hello, 'World');
    });
  });

  await t.step('Basic Tests', async (t) => {
    const bldr = fluentBuilder<{
      Hello: string;
      Nested: {
        Goodbye: string;
      } & $FluentTag<'Methods', 'Property'>;
    }>();

    await t.step('Object with Property', () => {
      const value = bldr.Hello('World').Export();

      assert(value);
      assertEquals(value.Hello, 'World');
    });

    await t.step('Nested Object with Property', () => {
      bldr.Hello('World');

      bldr.Nested({});

      const whole = bldr.Export();

      assert(whole);
      assertEquals(whole.Hello, 'World');
    });
  });
});
