import { runTest } from "../../../../src/common/types/testing/runTest.ts";
import type { $FluentTagExtractValue } from "../../../../src/fluent/types/tags/$FluentTagExtractValue.ts";

Deno.test("Testing $FluentTagExtractValue", async (t) => {
  // // Test for extracting a simple value from FluentTag
  // await t.step("Extract simple value", () => {
  //   type Result = $FluentTagExtractValue<
  //     { "@Methods-handlers": { save: () => void } },
  //     "Methods",
  //     "handlers"
  //   >;
  //   runTest<Result, { save: () => void }>(
  //     { save: () => {} },
  //     { save: () => {} },
  //   );
  // });

  // // Test for extracting from a record
  // await t.step("Extract value from Record", () => {
  //   type Result = $FluentTagExtractValue<
  //     { "@Methods-handlers": { log: () => {} } },
  //     "Methods",
  //     "handlers"
  //   >;
  //   runTest<
  //     Result,
  //     {
  //       log: () => {};
  //     }
  //   >({ log: () => ({}) }, { log: () => ({}) });
  // });

  // Test for non-existent data key (returns never)
  await t.step("Non-existent data key", () => {
    type Result = $FluentTagExtractValue<
      { "@Methods-handlers": { save: () => void } },
      "Methods",
      // @ts-ignore Using this to ensure bad values don't work
      "nonExistent"
    >;
    runTest<Result, never>(undefined as never, undefined as never);
  });

  // Test with union types
  await t.step("Handle union of types", () => {
    type UnionType = { "@Methods-handlers": { log: () => void } } & {
      "@Methods-generic": boolean;
    };

    type Result = $FluentTagExtractValue<UnionType, "Methods", "handlers">;
    // runTest<Result, { log: () => void }>({ log: () => {} }, { log: () => {} });
  });
});
