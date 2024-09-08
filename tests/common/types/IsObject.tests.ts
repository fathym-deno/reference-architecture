// deno-lint-ignore-file no-explicit-any
import type { IsObject } from "../../../src/common/types/IsObject.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("IsObject Tests with infer U", async (t) => {
  await t.step("Basic Object Checks", async (t) => {
    await t.step("Plain Object", () => {
      runTest<IsObject<{ a: number }>, true>(true, true);
    });

    await t.step("Array (should be false)", () => {
      runTest<IsObject<number[]>, false>(false, false);
    });

    await t.step("Union of Object and Literal", () => {
      runTest<IsObject<{ a: number } | 42>, false>(false, false);
    });

    await t.step("Intersection of Object and Array (should be false)", () => {
      runTest<IsObject<{ a: number } & string[]>, false>(false, false);
    });

    await t.step("Union of Object and Array (should be false)", () => {
      runTest<IsObject<{ a: number } | number[]>, false>(false, false);
    });
  });

  await t.step("Complex Object Checks", async (t) => {
    await t.step("Record<string, string>", () => {
      runTest<IsObject<Record<string, string>>, true>(true, true);
    });

    await t.step("Record with complex object", () => {
      runTest<IsObject<Record<string, { key: number }>>, true>(true, true);
    });

    await t.step("Nested Record", () => {
      runTest<IsObject<Record<string, Record<string, number>>>, true>(
        true,
        true,
      );
    });
  });

  await t.step("Union and Intersection Type Checks", async (t) => {
    await t.step("Union of Objects", () => {
      runTest<IsObject<{ a: number } | { b: string }>, true>(true, true);
    });

    await t.step("Union of Object and Array", () => {
      runTest<IsObject<{ a: number } | any[]>, false>(false, false);
    });

    await t.step("Intersection of Object and Literal", () => {
      runTest<IsObject<{ a: number } & { b: string }>, true>(true, true);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("Null (should be false)", () => {
      runTest<IsObject<null>, false>(false, false);
    });

    await t.step("Undefined (should be false)", () => {
      runTest<IsObject<undefined>, false>(false, false);
    });

    await t.step("Literal (should be false)", () => {
      runTest<IsObject<42>, false>(false, false);
    });

    await t.step("Never (should be false)", () => {
      runTest<IsObject<never>, false>(false, false);
    });
  });
});
