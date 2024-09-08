// deno-lint-ignore-file no-explicit-any
import { runTest } from "../../../../src/common/types/testing/runTest.ts";
import type { $FluentTagExists } from "../../../../src/fluent/types/tags/$FluentTagExists.ts";

Deno.test("Testing $FluentTagExists", async (t) => {
  // Basic test for FluentTagExists with a simple tag
  await t.step("Basic FluentTagExists", () => {
    type Result = $FluentTagExists<{ "@Methods": "Object" }, "Methods">;
    runTest<Result, true>(true, true);
  });

  // Test for a specific tag value
  await t.step("FluentTagExists with Specific Value", () => {
    type Result = $FluentTagExists<
      { "@Methods": "Record" },
      "Methods",
      "Record"
    >;
    runTest<Result, true>(true, true);
  });

  // Test for metadata presence in tag
  await t.step("FluentTagExists with Metadata Key", () => {
    type Result = $FluentTagExists<
      { "@Methods-handlers": { save: () => void } },
      "Methods",
      never,
      "handlers"
    >;
    runTest<Result, true>(true, true);
  });

  // Test for FluentTagExists with Record type
  await t.step("FluentTagExists with Record Type", () => {
    type Result = $FluentTagExists<
      {
        "@Methods": "Record";
        "@Methods-handlers": Record<string, (...args: any[]) => any>;
      },
      "Methods",
      "Record",
      "handlers"
    >;
    runTest<Result, true>(true, true);
  });

  // Test for multiple metadata fields
  await t.step("Multiple Metadata Fields in FluentTagExists", () => {
    type Result = $FluentTagExists<
      {
        "@Methods": "Object";
        "@Methods-generic": true;
        "@Methods-handlers": Record<string, (...args: any[]) => void>;
      },
      "Methods",
      "Object",
      "generic" | "handlers"
    >;
    runTest<Result, true>(true, true);
  });

  // Test for a missing tag
  await t.step("FluentTagExists with Missing Tag", () => {
    type Result = $FluentTagExists<{ "@Other": "Value" }, "Methods">;
    runTest<Result, false>(false, false);
  });

  // Test for a missing metadata key
  await t.step("FluentTagExists with Missing Metadata Key", () => {
    type Result = $FluentTagExists<
      { "@Methods": "Object" },
      "Methods",
      never,
      // @ts-ignore Using this to confirm 'false'
      "missingKey"
    >;
    runTest<Result, false>(false, false);
  });

  // Test for FluentTagExists with different tag value
  await t.step("FluentTagExists with Different Value", () => {
    type Result = $FluentTagExists<
      { "@Methods": "Property" },
      "Methods",
      "Record"
    >;
    runTest<Result, false>(false, false);
  });

  // Test for tag with no metadata
  await t.step("FluentTagExists with No Metadata", () => {
    type Result = $FluentTagExists<
      { "@Methods": "Record" },
      "Methods",
      "Record"
    >;
    runTest<Result, true>(true, true);
  });

  // Test for non-existent metadata in existing tag
  await t.step("FluentTagExists with Missing Metadata in Existing Tag", () => {
    type Result = $FluentTagExists<
      {
        "@Methods": "Object";
        "@Methods-handlers": Record<string, (...args: any[]) => void>;
      },
      "Methods",
      "Object",
      // @ts-ignore Using this to confirm 'false'
      "nonExistentKey"
    >;
    runTest<Result, false>(false, false);
  });
});
