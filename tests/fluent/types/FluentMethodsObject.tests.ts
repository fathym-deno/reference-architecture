// deno-lint-ignore-file ban-types
import { runTest } from '../../../src/common/types/testing/runTest.ts';
import type {
  FluentMethodsObject,
  FluentMethodsObjectGenericMethod,
} from '../../../src/fluent/types/FluentMethodsObject.ts';
import { SelectFluentBuilder } from '../../../src/fluent/types/SelectFluentBuilder.ts';
import type { $FluentTag } from '../../../src/fluent/types/tags/$FluentTag.ts';

Deno.test('Testing FluentMethodsObject', async (t) => {
  await t.step('Basic Object', () => {
    type Example = {
      Hello: string;
    };

    type Result = FluentMethodsObject<Example, 'key', {}>;

    type Expected = <
      T extends {
        someProp: string;
      }
    >() => SelectFluentBuilder<{}> & {
      [K in keyof T]: FluentMethodsObjectGenericMethod<T, K, {}>;
    };

    const c: Result = {};

    c().someProp('Something');

    // Expect the generic method to be included
    runTest<Result, Expected>(
      () => ({} as any),
      () => ({} as any)
    );
  });
});
