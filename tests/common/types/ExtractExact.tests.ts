import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { ExtractExact } from "../../../src/common/types/ExtractExact.ts";
import { assert } from "../../test.deps.ts";

export type $FluentTagMethodsOptions = "Record" | "Object" | "Property";

Deno.test("ExtractExact Tests", async (t) => {
  // Basic Functionality Tests
  await t.step("Basic Functionality Tests", async (t) => {
    await t.step("Exact String Literal Match", () => {
      type Extracted = ExtractExact<$FluentTagMethodsOptions, "Object">;
      type Expected = "Object";

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("No Exact Match", () => {
      type Extracted = ExtractExact<$FluentTagMethodsOptions, "NonExistent">;
      type Expected = never; // Should return `never` because no exact match

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Exact String Match from a Union", () => {
      type StringUnion = "foo" | "bar";
      type Extracted = ExtractExact<StringUnion, "foo">;
      type Expected = "foo";

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // Union and Intersection Types
  await t.step("Union and Intersection Types", async (t) => {
    await t.step("Union Type", () => {
      type StringUnion = "foo" | "bar" | "baz";
      type Extracted = ExtractExact<StringUnion, "foo">;
      type Expected = "foo";

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("No Match in Union", () => {
      type StringUnion = "foo" | "bar";
      type Extracted = ExtractExact<StringUnion, "baz">;
      type Expected = never; // No match, should return `never`

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // Edge Cases
  await t.step("Edge Cases", async (t) => {
    await t.step("Empty Union", () => {
      type EmptyUnion = never;
      type Extracted = ExtractExact<never, EmptyUnion>;
      type Expected = never; // No match, should return `never`

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("No Match", () => {
      type Extracted = ExtractExact<
        $FluentTagMethodsOptions,
        "NonMatchingString"
      >;
      type Expected = never;

      // Type assertion
      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });
});
