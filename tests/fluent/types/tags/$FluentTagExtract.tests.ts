import { runTest } from "../../../../src/common/testing/runTest.ts";
import type { $FluentTagExtract } from "../../../../src/fluent/types/tags/$FluentTagExtract.ts";
import type { $FluentTag } from "../../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("Testing $FluentTagExtract", async (t) => {
  // Basic test for extracting a simple Fluent tag
  await t.step("Extract Simple Fluent Tag", () => {
    type ExampleTag = $FluentTag<"Methods", "Object">;
    runTest<$FluentTagExtract<ExampleTag, "Methods">, "Object">(
      "Object",
      "Object",
    );
  });

  // Test for extracting complex tag values
  await t.step("Extract Complex Tag Values", () => {
    type ComplexTag = $FluentTag<
      "Methods",
      "Record",
      "handlers",
      { handlers: Record<string, () => void> }
    >;
    runTest<$FluentTagExtract<ComplexTag, "Methods">, "Record">(
      "Record",
      "Record",
    );
  });

  // Test extraction from nested records
  await t.step("Extract from Nested Record", () => {
    type NestedTag = Record<string, $FluentTag<"Methods", "Property">>;
    runTest<$FluentTagExtract<NestedTag["key"], "Methods">, "Property">(
      "Property",
      "Property",
    );
  });

  // Edge case: non-existent tag should return never
  await t.step("Non-existent Tag (Returns never)", () => {
    type ExampleTag = $FluentTag<"Methods", "Object">;

    // @ts-ignore Using to confirm bad values don't work
    runTest<$FluentTagExtract<ExampleTag, "NonExistent">, never>(
      undefined as never,
      undefined as never,
    );
  });
});
