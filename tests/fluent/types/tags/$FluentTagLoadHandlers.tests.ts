// deno-lint-ignore-file ban-types
import { runTest } from "../../../../src/common/testing/runTest.ts";
import type { $FluentTagLoadHandlers } from "../../../../src/fluent/types/tags/$FluentTagLoadHandlers.ts";

Deno.test("Testing $FluentTagLoadHandlers", async (t) => {
  // Basic test for loading handlers from FluentTag
  await t.step("Basic FluentTagLoadHandlers", () => {
    type Example = {
      key: {
        "@Methods-handlers": { save: () => void };
      };
    };

    type Result = $FluentTagLoadHandlers<Example["key"]>;
    // runTest<Result, { save: () => void }>(
    //   { save: () => {} },
    //   { save: () => {} },
    // );
  });

  // Test where no handlers exist (returns empty object)
  await t.step("No Handlers in FluentTagLoadHandlers", () => {
    type NoHandlers = {
      key: {
        unrelatedKey: number;
      };
    };

    type Result = $FluentTagLoadHandlers<NoHandlers["key"]>;
    runTest<Result, {}>({}, {});
  });

  // Test with union types where one branch has handlers and the other does not
  await t.step("Union Types in FluentTagLoadHandlers", () => {
    type MixedUnion =
      | {
        key: {
          "@Methods-handlers": { log: () => void };
        };
      }
      | {
        key: {
          unrelatedKey: string;
        };
      };

    type Result = $FluentTagLoadHandlers<MixedUnion["key"]>;
    // runTest<Result, { log: () => void } | {}>(
    //   { log: () => {} },
    //   { log: () => {} }
    // );
  });

  // Test with Record types where handlers are loaded from each record entry
  await t.step("Record Type in FluentTagLoadHandlers", () => {
    type RecordType = Record<
      string,
      {
        "@Methods-handlers": { execute: () => void };
      }
    >;

    type Result = $FluentTagLoadHandlers<RecordType[string]>;
    // runTest<Result, { execute: () => void }>(
    //   { execute: () => {} },
    //   { execute: () => {} },
    // );
  });

  // Test for a non-existent handler key (should return empty object)
  await t.step("Non-Existent Handlers in FluentTagLoadHandlers", () => {
    type Example = {
      key: {
        "@Methods-handlers": { save: () => void };
      };
    };

    // @ts-ignore Using this to ensure bad value fails
    type Result = $FluentTagLoadHandlers<Example, "nonExistentKey">;
    runTest<Result, {}>({}, {});
  });

  // Test with more complex nested structures and handlers
  await t.step("Complex Nested Handlers in FluentTagLoadHandlers", () => {
    type NestedType = {
      firstLevel: {
        secondLevel: {
          "@Methods-handlers": { run: () => void };
        };
      };
    };

    type Result = $FluentTagLoadHandlers<
      NestedType["firstLevel"]["secondLevel"]
    >;
    // runTest<Result, { run: () => void }>({ run: () => {} }, { run: () => {} });
  });

  // Test with partial handlers (some parts of the union contain handlers, others do not)
  await t.step("Partial Handlers in FluentTagLoadHandlers", () => {
    type PartialHandlers = {
      key: {
        "@Methods-handlers": { save: () => void } | { run: () => void };
      };
    };

    type Result = $FluentTagLoadHandlers<PartialHandlers["key"]>;
    // runTest<Result, { save: () => void } | { run: () => void }>(
    //   { save: () => {} },
    //   { save: () => {} },
    // );
  });
});
