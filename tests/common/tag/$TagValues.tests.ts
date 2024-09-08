import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("$TagValues Type Tests", async (t) => {
  // Basic test for $TagValues with a simple tag
  await t.step("Basic Tag", () => {
    type Result = $TagValues<"test", "tag">;
    runTest<Result, { "@test"?: "tag" }>(
      { "@test": "tag" }, // Provide the actual value to be tested
      { "@test": "tag" }, // Provide the expected value
    );
  });

  // Test for $TagValues with additional metadata values
  await t.step("Tag with Additional Metadata", () => {
    type Result = $TagValues<"test", "tag", "label", { label: boolean }>;
    runTest<Result, { "@test"?: "tag"; "@test-label"?: boolean }>(
      { "@test": "tag", "@test-label": true },
      { "@test": "tag", "@test-label": true },
    );
  });

  // Test with multiple metadata fields
  await t.step("Multiple Metadata Fields", () => {
    type Result = $TagValues<
      "status",
      number,
      "info" | "error",
      { info: string; error: boolean }
    >;
    runTest<
      Result,
      { "@status"?: number; "@status-info"?: string; "@status-error"?: boolean }
    >(
      { "@status": 42, "@status-info": "some info", "@status-error": false }, // Actual value to be tested
      { "@status": 42, "@status-info": "some info", "@status-error": false }, // Expected value
    );
  });

  // Test with Record type in TValues
  await t.step("Record Type in TValues", () => {
    type Result = $TagValues<
      "record",
      string,
      "meta",
      { meta: Record<string, number> }
    >;
    runTest<
      Result,
      { "@record"?: string; "@record-meta"?: Record<string, number> }
    >(
      { "@record": "recordValue", "@record-meta": { key1: 100, key2: 200 } },
      { "@record": "recordValue", "@record-meta": { key1: 100, key2: 200 } },
    );
  });

  // Test with nested Record types
  await t.step("Nested Record Type in TValues", () => {
    type Result = $TagValues<
      "nested",
      boolean,
      "info",
      { info: Record<string, Record<string, string>> }
    >;
    runTest<
      Result,
      {
        "@nested"?: boolean;
        "@nested-info"?: Record<string, Record<string, string>>;
      }
    >(
      { "@nested": true, "@nested-info": { outerKey: { innerKey: "value" } } },
      { "@nested": true, "@nested-info": { outerKey: { innerKey: "value" } } },
    );
  });

  // Test when TData is never (should only add the base tag)
  await t.step("No Additional Metadata", () => {
    type Result = $TagValues<"test", number>;
    runTest<Result, { "@test"?: number }>(
      { "@test": 123 }, // Actual value
      { "@test": 123 }, // Expected value
    );
  });

  // Test with multiple fields in TData
  await t.step("Multiple Fields in TData", () => {
    type Result = $TagValues<
      "status",
      { active: boolean },
      "info" | "warning",
      { info: string; warning: boolean }
    >;

    runTest<
      Result,
      {
        "@status"?: { active: boolean };
        "@status-info"?: string;
        "@status-warning"?: boolean;
      }
    >(
      {
        "@status": { active: true },
        "@status-info": "details",
        "@status-warning": false,
      },
      {
        "@status": { active: true },
        "@status-info": "details",
        "@status-warning": false,
      },
    );
  });

  await t.step("Tag Creation", () => {
    type testTag = $TagValues<
      "Test",
      "Thing",
      "value" | "trim",
      { trim: "true"; value: "false" }
    >;

    const check: testTag = {
      // Hello: 'World',
      "@Test": "Thing",
      "@Test-trim": "true",
      "@Test-value": "false",
    };

    assert(check);
    assertEquals(check["@Test-trim"], "true");
    assertEquals(check["@Test-value"], "false");

    type testValue = NonNullable<testTag["@Test-value"]> extends "false" ? true
      : false;

    const checkValue: testValue = true;

    assert(checkValue);
  });
});
