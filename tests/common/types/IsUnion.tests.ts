// deno-lint-ignore-file no-explicit-any
import type { IsUnion } from "../../../src/common/types/IsUnion.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("IsUnion Tests", async (t) => {
  // Basic tests for union and non-union types
  await t.step("Basic Union Tests", async (t) => {
    await t.step("Union of string and number (should be true)", () => {
      runTest<IsUnion<string | number>, true>(true, true);
    });

    await t.step("Non-union type (string should be false)", () => {
      runTest<IsUnion<string>, false>(false, false);
    });

    await t.step("Intersection (string & number should be false)", () => {
      runTest<IsUnion<string & number>, false>(false, false);
    });
  });

  // Tests with complex types like records
  await t.step("Complex Type Tests", async (t) => {
    await t.step("Simple Record (should be false)", () => {
      runTest<IsUnion<Record<string, string>>, false>(false, false);
    });

    await t.step("Union of Records (should be true)", () => {
      runTest<IsUnion<Record<string, string> | Record<number, number>>, true>(
        true,
        true,
      );
    });

    await t.step("Nested Record (should be false)", () => {
      runTest<IsUnion<Record<string, { nested: number }>>, false>(false, false);
    });
  });

  // Edge case tests for `never`, `any`, and arrays
  await t.step("Edge Case Tests", async (t) => {
    await t.step("Never (should be false)", () => {
      runTest<IsUnion<never>, false>(false, false);
    });

    await t.step("Any (should be false)", () => {
      runTest<IsUnion<any>, false>(false, false);
    });

    await t.step("Array type (should be false)", () => {
      runTest<IsUnion<number[]>, false>(false, false);
    });
  });
});
