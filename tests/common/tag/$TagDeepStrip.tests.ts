import { assert } from "../../test.deps.ts";
import type {
  $TagDeepStrip,
  $TagDeepStripObject,
} from "../../../src/common/tags/$TagDeepStrip.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/testing/runTest.ts";
import type { $FluentTag } from "../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("Testing $TagDeepStrip", async (t) => {
  type TestTag = $TagValues<
    "TestTag",
    "tag",
    "name" | "age",
    { name: "Pete"; age: 41 }
  >;

  type TestTagValue = TestTag & {
    unrelatedKey: boolean;
  };

  await t.step("Strip tags from array", () => {
    type TestArray = [TestTagValue, TestTagValue];
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
      data: TestTagValue;
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
    type TestTuple = [TestTagValue, string];
    runTest<
      $TagDeepStrip<TestTuple, "TestTag">,
      [{ unrelatedKey: boolean }, string]
    >([{ unrelatedKey: true }, "value"], [{ unrelatedKey: true }, "value"]);
  });

  await t.step("Handle union of tagged and untagged types", () => {
    type MixedUnion = TestTagValue | { key: string };
    runTest<
      $TagDeepStrip<MixedUnion, "TestTag">,
      { unrelatedKey: boolean } | { key: string }
    >({ unrelatedKey: true }, { unrelatedKey: true });
  });

  await t.step("Handle nested objects with tags", () => {
    type NestedRecord = { inner: TestTagValue };
    runTest<
      $TagDeepStrip<NestedRecord, "TestTag">,
      { inner: { unrelatedKey: boolean } }
    >({ inner: { unrelatedKey: true } }, { inner: { unrelatedKey: true } });
  });

  await t.step("Fully Strip", () => {
    type c = {
      Hello: { New: string } & $FluentTag<"Methods", "Object">;
      Record: Record<string, { Old: string } & $FluentTag<"Methods", "Object">>;
    } & $FluentTag<"Methods", "Object">;

    type cStrip = $TagDeepStrip<c, "Methods">;

    const stripped: cStrip = {
      Hello: { New: "" },
      Record: {
        test: {
          Old: "",
        },
      },
    };

    assert(stripped);
  });

  await t.step("Tag Deep Stripped", () => {
    type test = {
      Bucket:
        & Record<
          string,
          {
            BringIt: boolean;
          }
        >
        & TestTag;
    };

    type tagStripped1 = $TagDeepStripObject<test, "TestTag">;

    const stripped1: tagStripped1 = {
      Bucket: { Test: { BringIt: true } },
    };

    assert(stripped1);

    type tagStripped2 = $TagDeepStrip<test, "TestTag">;

    const stripped2: tagStripped2 = {
      // Hello: 'World',
      Bucket: { "Test": { BringIt: true } },
    };

    assert(stripped2);
    // assert(stripped2.Bucket[''].BringIt);
  });
});
