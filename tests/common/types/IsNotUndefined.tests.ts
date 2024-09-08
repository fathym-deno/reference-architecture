import type { IsNotUndefined } from "../../../src/common/types/IsNotUndefined.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("IsNotUndefined Tests", async (t) => {
  await t.step("Basic Checks", async (t) => {
    await t.step("Non-undefined type (should be true)", () => {
      runTest<IsNotUndefined<number>, true>(true, true);
    });

    await t.step("Undefined (should be false)", () => {
      runTest<IsNotUndefined<undefined>, false>(false, false);
    });

    await t.step("Union with undefined (should be false)", () => {
      runTest<IsNotUndefined<string | undefined>, false>(false, false);
    });

    await t.step("Union without undefined (should be true)", () => {
      runTest<IsNotUndefined<string | number>, true>(true, true);
    });
  });

  await t.step("Record Type Checks", async (t) => {
    await t.step("Simple Record (should be true)", () => {
      runTest<IsNotUndefined<Record<string, string>>, true>(true, true);
    });

    await t.step("Record with optional undefined value", () => {
      runTest<IsNotUndefined<string | undefined>, false>(false, false);
    });

    await t.step("Record with complex object value", () => {
      runTest<IsNotUndefined<Record<string, { key: number }>>, true>(
        true,
        true,
      );
    });

    await t.step("Record<string, Record<string, undefined>>", () => {
      runTest<IsNotUndefined<Record<string, Record<string, undefined>>>, true>(
        true,
        true,
      );
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("Intersection with undefined (should be false)", () => {
      runTest<IsNotUndefined<number & undefined>, false>(false, false);
    });

    await t.step("Union of literals and undefined", () => {
      runTest<IsNotUndefined<42 | undefined>, false>(false, false);
    });

    await t.step("Array type (should be true)", () => {
      runTest<IsNotUndefined<number[]>, true>(true, true);
    });
  });
});
