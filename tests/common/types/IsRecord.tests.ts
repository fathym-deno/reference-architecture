// deno-lint-ignore-file no-explicit-any
import type { IsMatched } from "../../../src/common/types/IsMatched.ts";
import type { IsRecord } from "../../../src/common/types/IsRecord.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";
import type { $FluentTag } from "../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("Testing IsRecord<T>", async (t) => {
  // Primitive types should return false
  await t.step("Primitive types return false", () => {
    runTest<IsRecord<string>, false>(false, false);
    runTest<IsRecord<number>, false>(false, false);
    runTest<IsRecord<boolean>, false>(false, false);
  });

  // Native types should return false
  await t.step("Native types return false", () => {
    runTest<IsRecord<Date>, false>(false, false);
    runTest<IsRecord<Array<any>>, false>(false, false);
  });

  // Objects without index signatures should return false
  await t.step("Objects without index signatures return false", () => {
    type SimpleObject = { name: string; age: number };
    runTest<IsRecord<SimpleObject>, false>(false, false);
  });

  // Record types should return true
  await t.step("Record types return true", () => {
    runTest<IsRecord<Record<string, any>>, true>(true, true);
  });

  // Complex objects with index signatures should return true
  await t.step("Complex objects with index signatures return true", () => {
    type ComplexObject = {
      name: string;
      age: number;
      [key: string]: any;
    };
    runTest<IsRecord<ComplexObject>, true>(true, true);
  });

  // Objects with arrays inside should still return false if no index signatures
  await t.step(
    "Objects with arrays but no index signatures return false",
    () => {
      type ObjectWithArray = {
        items: string[];
      };
      runTest<IsRecord<ObjectWithArray>, false>(false, false);
    },
  );

  // Nested Record types should return true
  await t.step("Nested Record types return true", () => {
    type NestedRecord = Record<string, Record<string, any>>;
    runTest<IsRecord<NestedRecord>, true>(true, true);
  });

  // Mixed case with union types should handle correctly
  await t.step("Union types should handle correctly", () => {
    type UnionCase = { name: string } | Record<string, any>;
    runTest<IsMatched<IsRecord<UnionCase>>, true>(true, true);
    runTest<IsMatched<IsRecord<UnionCase>, true>, false>(false, false);
  });

  // Edge case: undefined or null
  await t.step("Edge case: undefined or null should return false", () => {
    runTest<IsRecord<undefined>, false>(false, false);
    runTest<IsRecord<null>, false>(false, false);
  });

  // Mixed case with union types should handle correctly
  await t.step("Complex from EaC", () => {
    type EaCModuleHandler = {
      APIPath: string;

      Order: number;
    };
    type EaCModuleHandlers = {
      $Force?: boolean;
    } & Record<string, EaCModuleHandler & $FluentTag<"Methods", "Object">>;

    runTest<IsRecord<EaCModuleHandlers>, true>(true, true);
  });
});
