// deno-lint-ignore-file no-explicit-any ban-types
import { runTest } from "../../../../src/common/types/testing/runTest.ts";
import type { $FluentTag } from "../../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("Testing $FluentTag", async (t) => {
  // Positive test cases
  // Basic test for $FluentTag with a simple tag
  await t.step("Basic FluentTag", () => {
    type Result = $FluentTag<"Methods", "Object">;
    runTest<Result, { "@Methods"?: "Object" }>(
      { "@Methods": "Object" },
      { "@Methods": "Object" },
    );
  });

  // Test for $FluentTag with additional metadata values
  await t.step("FluentTag with Additional Metadata", () => {
    type Result = $FluentTag<
      "Methods",
      "Record",
      "generic" | "handlers",
      { generic: true; handlers: { save: () => void } }
    >;
    // runTest<
    //   Result,
    //   {
    //     "@Methods"?: "Record";
    //     "@Methods-generic"?: true;
    //     "@Methods-handlers"?: { save: () => void };
    //   }
    // >(
    //   {
    //     "@Methods": "Record",
    //     "@Methods-generic": true,
    //     "@Methods-handlers": { save: () => {} },
    //   },
    //   {
    //     "@Methods": "Record",
    //     "@Methods-generic": true,
    //     "@Methods-handlers": { save: () => {} },
    //   },
    // );
  });

  // Test with Record types
  await t.step("Record Type in FluentTag", () => {
    type Result = $FluentTag<
      "Methods",
      "Record",
      "handlers",
      { handlers: { log: () => {} } }
    >;

    // runTest<
    //   Result,
    //   {
    //     "@Methods": "Record";
    //     "@Methods-handlers": { log: () => {} };
    //   }
    // >(
    //   { "@Methods": "Record", "@Methods-handlers": { log: () => ({}) } },
    //   { "@Methods": "Record", "@Methods-handlers": { log: () => ({}) } },
    // );
  });

  // Test when TData is never (no additional metadata)
  await t.step("No Additional Metadata", () => {
    type Result = $FluentTag<"Methods", "Property">;
    runTest<Result, { "@Methods"?: "Property" }>(
      { "@Methods": "Property" },
      { "@Methods": "Property" },
    );
  });

  // Test with empty metadata and Record type
  await t.step("Empty Metadata with Record Type", () => {
    type Result = $FluentTag<"Methods", "Record", never>;
    runTest<Result, { "@Methods"?: "Record" }>(
      { "@Methods": "Record" },
      { "@Methods": "Record" },
    );
  });

  // Test with multiple metadata fields
  await t.step("Multiple Metadata Fields", () => {
    type Result = $FluentTag<
      "Methods",
      "Object",
      "generic" | "handlers",
      { generic: true; handlers: Record<string, (...args: any[]) => void> }
    >;
    // runTest<
    //   Result,
    //   {
    //     "@Methods"?: "Object";
    //     "@Methods-generic"?: true;
    //     "@Methods-handlers"?: Record<string, (...args: any[]) => void>;
    //   }
    // >(
    //   {
    //     "@Methods": "Object",
    //     "@Methods-generic": true,
    //     "@Methods-handlers": { save: () => {} },
    //   },
    //   {
    //     "@Methods": "Object",
    //     "@Methods-generic": true,
    //     "@Methods-handlers": { save: () => {} },
    //   },
    // );
  });
});
