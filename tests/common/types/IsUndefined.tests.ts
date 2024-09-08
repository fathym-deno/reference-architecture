// deno-lint-ignore-file ban-types
import type { IsUndefined } from "../../../src/common/types/IsUndefined.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("IsUndefined Tests", async (t) => {
  await t.step("Simple Types", async (t) => {
    await t.step("Directly undefined", () => {
      runTest<IsUndefined<undefined>, true>(true, true);
    });

    await t.step("Non-undefined type", () => {
      runTest<IsUndefined<number>, false>(false, false);
    });

    await t.step("Union with undefined", () => {
      runTest<IsUndefined<number | undefined>, true>(true, true);
    });
  });

  await t.step("Complex Types", async (t) => {
    await t.step("Optional property", () => {
      type TestType = { a?: string };
      runTest<IsUndefined<TestType["a"]>, true>(true, true);
    });

    await t.step("Nested optional property", () => {
      type TestType = { a?: { b?: string } };
      runTest<IsUndefined<TestType["a"]>, true>(true, true);
    });

    await t.step("Record with undefined value", () => {
      type TestType = Record<string, undefined>;
      runTest<IsUndefined<TestType[keyof TestType]>, true>(true, true);
    });

    await t.step("Record with optional undefined value", () => {
      type TestType = Record<string, string | undefined>;
      runTest<IsUndefined<TestType[keyof TestType]>, true>(true, true);
    });

    await t.step("Intersection type with undefined", () => {
      runTest<IsUndefined<string & undefined>, true>(true, true);
    });

    await t.step("Empty type (should not be undefined)", () => {
      runTest<IsUndefined<{}>, false>(false, false);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("Optional property as undefined", () => {
      type TestType = { a?: string };
      runTest<IsUndefined<undefined | string>, true>(true, true);
    });

    await t.step("Union with undefined and other types", () => {
      runTest<IsUndefined<undefined | string | number>, true>(true, true);
    });

    await t.step("Never type (should not be undefined)", () => {
      runTest<IsUndefined<never>, true>(true, true);
    });
  });
});
