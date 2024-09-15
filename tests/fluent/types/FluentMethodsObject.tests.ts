// deno-lint-ignore-file ban-types
import { runTest } from '../../../src/common/types/testing/runTest.ts';
import type {
  FluentMethodsObject,
  FluentMethodsObjectGenericMethod,
  FluentMethodsObjectReturnType,
} from '../../../src/fluent/types/FluentMethodsObject.ts';
import type { SelectFluentBuilder } from '../../../src/fluent/types/SelectFluentBuilder.ts';
import type { $FluentTag } from '../../../src/fluent/types/tags/$FluentTag.ts';

Deno.test('Testing FluentMethodsObject', async (t) => {
  await t.step('Basic Object', () => {
    type Example = {
      Hello: string;
    };

    type Result = FluentMethodsObject<Example, {}, 0>;
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
