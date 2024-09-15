// deno-lint-ignore-file ban-types
import { runTest } from '../../../src/common/types/testing/runTest.ts';
import type { FluentMethodsObjectReturnType } from '../../../src/fluent/types/FluentMethodsObject.ts';
import type { FluentMethodsProperty } from '../../../src/fluent/types/FluentMethodsProperty.ts';

Deno.test('Testing FluentMethodsProperty', async (t) => {
  await t.step('Primitive', () => {
    type Example = string;

    type Result = FluentMethodsProperty<Example, never, never, {}, 0>;
    type x = ReturnType<Result>;

    type Expected = () => FluentMethodsObjectReturnType<
      {
        Hello: string;
      },
      {},
      0
    >;

    const c: Result = {};

    c().Hello('World');

    // Expect the generic method to be included
    runTest<Result, Expected>(
      () => ({} as any),
      () => ({} as any)
    );
  });
});
