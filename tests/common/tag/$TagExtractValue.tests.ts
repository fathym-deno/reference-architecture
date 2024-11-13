import type { $TagExtractValue } from "../../../src/common/tags/$TagExtractValue.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/testing/runTest.ts";
import { assertEquals } from "../../test.deps.ts";

Deno.test("Testing $TagExtractValue", async (t) => {
  type TestTagValues =
    & $TagValues<
      "TestTag",
      "tag",
      "name" | "age",
      { name: "Pete"; age: 41 }
    >
    & {
      unrelatedKey: boolean;
    };

  await t.step("Extract value from simple tag", () => {
    type x = $TagExtractValue<TestTagValues, "TestTag", "name">;

    runTest<$TagExtractValue<TestTagValues, "TestTag", "name">, "Pete">(
      "Pete",
      "Pete",
    );
  });

  await t.step("Extract value for number tag", () => {
    runTest<$TagExtractValue<TestTagValues, "TestTag", "age">, 41>(41, 41);
  });

  await t.step("Non-existent tag (returns never)", () => {
    runTest<$TagExtractValue<TestTagValues, "NonExistentTag", "name">, never>(
      undefined as never,
      undefined as never,
    );
  });

  await t.step("Handle nested records with tags", () => {
    type NestedRecord = { inner: TestTagValues };
    runTest<$TagExtractValue<NestedRecord["inner"], "TestTag", "name">, "Pete">(
      "Pete",
      "Pete",
    );
  });

  await t.step("Union type with and without tags", () => {
    type MixedUnion = TestTagValues & { unrelatedKey: boolean };
    runTest<$TagExtractValue<MixedUnion, "TestTag", "name">, "Pete">(
      "Pete",
      "Pete",
    );
  });

  await t.step("Tag Value Only Extracts", () => {
    type tagged = $TagValues<"Test", never, "test", { test: true }>;

    type tagValue = $TagExtractValue<tagged, "Test", "test">;

    type tagValueCheck = true extends tagValue ? true : false;

    const value: tagValueCheck = true;

    assertEquals(value, true);
  });
});
