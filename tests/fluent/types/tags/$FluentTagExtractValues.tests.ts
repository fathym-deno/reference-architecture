// deno-lint-ignore-file no-explicit-any
import { runTest } from "../../../../src/common/types/testing/runTest.ts";
import type { $FluentTagExtractValues } from "../../../../src/fluent/types/tags/$FluentTagExtractValues.ts";

Deno.test("Testing $FluentTagExtractValues", async (t) => {
  // Simple extraction of values
  await t.step("Extract values from FluentTag", () => {
    type FluentTag = {
      "@Methods-generic": true;
      "@Methods-handlers": { save: () => void };
    };

    type Result = $FluentTagExtractValues<
      FluentTag,
      "Methods",
      "generic" | "handlers"
    >;

    // runTest<
    //   Result,
    //   {
    //     Methods: {
    //       generic: true;
    //       handlers: { save: () => void };
    //     };
    //   }
    // >(
    //   {
    //     Methods: {
    //       generic: true,
    //       handlers: { save: () => {} },
    //     },
    //   },
    //   {
    //     Methods: {
    //       generic: true,
    //       handlers: { save: () => {} },
    //     },
    //   },
    // );
  });

  // Test with Record type
  await t.step("Extract values from FluentTag with Record type", () => {
    type FluentTag = {
      "@Methods-handlers": Record<string, (...args: any[]) => any>;
    };

    type Result = $FluentTagExtractValues<FluentTag, "Methods", "handlers">;

    // runTest<
    //   Result,
    //   {
    //     Methods: {
    //       handlers: Record<string, (...args: any[]) => any>;
    //     };
    //   }
    // >(
    //   {
    //     Methods: {
    //       handlers: { log: () => {} },
    //     },
    //   },
    //   {
    //     Methods: {
    //       handlers: { log: () => {} },
    //     },
    //   },
    // );
  });

  // Test nested record
  await t.step("Extract values from nested record", () => {
    type NestedRecord = {
      inner: {
        "@Methods-generic": true;
        "@Methods-handlers": { save: () => void };
      };
    };

    type Result = $FluentTagExtractValues<
      NestedRecord["inner"],
      "Methods",
      "generic" | "handlers"
    >;

    // runTest<
    //   Result,
    //   {
    //     Methods: {
    //       generic: true;
    //       handlers: { save: () => void };
    //     };
    //   }
    // >(
    //   {
    //     Methods: {
    //       generic: true,
    //       handlers: { save: () => {} },
    //     },
    //   },
    //   {
    //     Methods: {
    //       generic: true,
    //       handlers: { save: () => {} },
    //     },
    //   },
    // );
  });

  // Test with missing tag data (returns never)
  await t.step("Missing tag data returns never", () => {
    type FluentTag = {
      "@Methods-generic": true;
    };

    type Result = $FluentTagExtractValues<FluentTag, "Methods", "handlers">;

    runTest<Result, { Methods: { handlers: never } }>(
      { Methods: { handlers: undefined as never } },
      { Methods: { handlers: undefined as never } },
    );
  });

  // Test with union types
  await t.step("Extract values from union type", () => {
    type FluentTag =
      | {
        "@Methods-generic": true;
        "@Methods-handlers": { log: () => void };
      }
      | {
        "@Methods-generic": false;
        "@Methods-handlers": { save: () => void };
      };

    type Result = $FluentTagExtractValues<
      FluentTag,
      "Methods",
      "generic" | "handlers"
    >;

    // runTest<
    //   Result,
    //   {
    //     Methods: {
    //       generic: true | false;
    //       handlers: { log: () => void } | { save: () => void };
    //     };
    //   }
    // >(
    //   {
    //     Methods: {
    //       generic: true,
    //       handlers: { log: () => {} },
    //     },
    //   },
    //   {
    //     Methods: {
    //       generic: true,
    //       handlers: { log: () => {} },
    //     },
    //   },
    // );
  });
});
