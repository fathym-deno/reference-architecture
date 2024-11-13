// deno-lint-ignore-file ban-types
import { runTest } from "../../../../src/common/testing/runTest.ts";
import type { $FluentTagDeepStrip } from "../../../../src/fluent/types/tags/$FluentTagDeepStrip.ts";

Deno.test("Testing $FluentTagDeepStrip", async (t) => {
  // Basic test for stripping FluentTag from a simple object
  await t.step("Strip FluentTag from simple object", () => {
    type Result = $FluentTagDeepStrip<{ "@Methods": "Record" }, "Methods">;
    runTest<Result, {}>(
      {}, // Expected result
      {}, // Actual result
    );
  });

  // Test for stripping FluentTag from a nested object
  await t.step("Strip FluentTag from nested object", () => {
    type Result = $FluentTagDeepStrip<
      { "@Methods": "Object"; inner: { "@Methods-generic": true } },
      "Methods"
    >;
    runTest<Result, { inner: {} }>(
      { inner: {} }, // Expected result
      { inner: {} }, // Actual result
    );
  });

  // Test for stripping FluentTag from array
  await t.step("Strip FluentTag from array", () => {
    type Result = $FluentTagDeepStrip<
      [{ "@Methods": "Record" }, { "@Methods": "Object" }],
      "Methods"
    >;
    runTest<Result, [{}, {}]>(
      [{}, {}], // Expected result
      [{}, {}], // Actual result
    );
  });

  // Test for stripping FluentTag from tuple
  await t.step("Strip FluentTag from tuple", () => {
    type Result = $FluentTagDeepStrip<
      [{ "@Methods": "Record" }, string],
      "Methods"
    >;
    runTest<Result, [{}, string]>(
      [{}, "example"], // Expected result
      [{}, "example"], // Actual result
    );
  });

  // Test for handling a union of tagged and untagged objects
  await t.step("Handle union of tagged and untagged objects", () => {
    type Result = $FluentTagDeepStrip<
      { "@Methods": "Record" } | { key: string },
      "Methods"
    >;
    runTest<Result, {} | { key: string }>(
      { key: "value" }, // Expected result
      { key: "value" }, // Actual result
    );
  });

  // Test for handling deeply nested Records with FluentTag
  await t.step("Handle deeply nested records", () => {
    type Result = $FluentTagDeepStrip<
      { record: { "@Methods": "Record"; inner: { "@Methods-generic": true } } },
      "Methods"
    >;
    runTest<Result, { record: { inner: {} } }>(
      { record: { inner: {} } }, // Expected result
      { record: { inner: {} } }, // Actual result
    );
  });
});
