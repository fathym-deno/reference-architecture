import type { $TagDeepStrip } from "../../../src/common/tags/$TagDeepStrip.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("Testing $TagDeepStrip", async (t) => {
  type TestTag =
    & $TagValues<
      "TestTag",
      "tag",
      "name" | "age",
      { name: "Pete"; age: 41 }
    >
    & {
      unrelatedKey: boolean;
    };

  await t.step("Strip tags from array", () => {
    type TestArray = [TestTag, TestTag];
    runTest<
      $TagDeepStrip<TestArray, "TestTag">,
      [{ unrelatedKey: boolean }, { unrelatedKey: boolean }]
    >(
      [{ unrelatedKey: true }, { unrelatedKey: true }],
      [{ unrelatedKey: true }, { unrelatedKey: true }],
    );
  });

  await t.step("Strip tags from object", () => {
    type TestObject = {
      data: TestTag;
      extra: number;
    };
    runTest<
      $TagDeepStrip<TestObject, "TestTag">,
      { data: { unrelatedKey: boolean }; extra: number }
    >(
      { data: { unrelatedKey: true }, extra: 5 },
      { data: { unrelatedKey: true }, extra: 5 },
    );
  });

  await t.step("Strip tags from tuple", () => {
    type TestTuple = [TestTag, string];
    runTest<
      $TagDeepStrip<TestTuple, "TestTag">,
      [{ unrelatedKey: boolean }, string]
    >(
      [{ unrelatedKey: true }, "value"],
      [{ unrelatedKey: true }, "value"],
    );
  });

  await t.step("Handle union of tagged and untagged types", () => {
    type MixedUnion = TestTag | { key: string };
    runTest<
      $TagDeepStrip<MixedUnion, "TestTag">,
      { unrelatedKey: boolean } | { key: string }
    >({ unrelatedKey: true }, { unrelatedKey: true });
  });

  await t.step("Handle nested objects with tags", () => {
    type NestedRecord = { inner: TestTag };
    runTest<
      $TagDeepStrip<NestedRecord, "TestTag">,
      { inner: { unrelatedKey: boolean } }
    >(
      { inner: { unrelatedKey: true } },
      { inner: { unrelatedKey: true } },
    );
  });
});
