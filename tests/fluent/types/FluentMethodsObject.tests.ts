// deno-lint-ignore-file ban-types
import type { FluentMethodsObject } from "../../../src/fluent/types/FluentMethodsObject.ts";
import type { $FluentTag } from "../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("Testing FluentMethodsObject", async (t) => {
  // Example test with a generic method
  await t.step("FluentMethodsObject with generic method", () => {
    type Example = {
      key: {
        someProp: string;
      } & $FluentTag<"Methods", never, "generic", { generic: true }>;
    };

    type Result = FluentMethodsObject<Example, "key", {}>;

    // const c: Result = {}

    // c().someProp('Something');

    // Expect the generic method to be included
    // runTest<
    //   Result,
    //   {
    //     (): FluentMethodsObjectReturnType<Example['key'],
    //       {}
    //     >;
    //   }
    // >(
    //   () => ({} as any),
    //   () => ({} as any)
    // );
  });

  // Example test with a non-generic method
  await t.step("FluentMethodsObject with non-generic method", () => {
    type Example = {
      key: {
        someProp: string;
      };
    };

    type Result = FluentMethodsObject<Example, "key", {}>;

    // Expect a non-generic method to be included
    // runTest<
    //   Result,
    //   {
    //     (): FluentMethodsObjectReturnType<
    //       {
    //         someProp: string;
    //       },
    //       {}
    //     >;
    //   }
    // >(
    //   () => ({} as any),
    //   () => ({} as any),
    // );
  });

  // Test with a Record type
  await t.step("FluentMethodsObject with Record type", () => {
    type RecordExample = Record<
      string,
      {
        "@Methods-generic": true;
        someProp: string;
      } & $FluentTag<"Methods", never, "generic", { generic: true }>
    >;

    type Result = FluentMethodsObject<RecordExample, string, {}>;

    // runTest<
    //   Result,
    //   {
    //     (): FluentMethodsObjectReturnType<
    //       {
    //         someProp: string;
    //       },
    //       {}
    //     >;
    //   }
    // >(
    //   () => ({} as any),
    //   () => ({} as any)
    // );
  });

  // Test with nested objects and complex types
  await t.step("FluentMethodsObject with nested objects", () => {
    type NestedExample = {
      outerKey: {
        innerKey: {
          anotherProp: number;
        } & $FluentTag<"Methods", never, "generic", { generic: true }>;
      };
    };

    type Result = FluentMethodsObject<NestedExample, "outerKey", {}>;

    // const c: Result = {};

    // c().innerKey().anotherProp(43);

    // runTest<
    //   Result,
    //   {
    //     (): FluentMethodsObjectReturnType<
    //       {
    //         innerKey: {
    //           anotherProp: number;
    //         };
    //       },
    //       {}
    //     >;
    //   }
    // >(
    //   () => ({} as any),
    //   () => ({} as any)
    // );
  });
});
