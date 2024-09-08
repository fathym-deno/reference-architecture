import type { $TagExtractValueAndStrip } from "../../../src/common/tags/$TagExtractValueAndStrip.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("Testing $TagExtractValueAndStrip", async (t) => {
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

  await t.step("Extract value and strip tags", () => {
    runTest<
      $TagExtractValueAndStrip<TestTag, "TestTag", "tag", "name">,
      {
        Stripped: { unrelatedKey: boolean };
        Value: "Pete";
      }
    >(
      {
        Stripped: { unrelatedKey: true },
        Value: "Pete",
      },
      {
        Stripped: { unrelatedKey: true },
        Value: "Pete",
      },
    );
  });

  await t.step("Extract value from complex nested type", () => {
    type NestedRecord = { inner: TestTag };

    type x = $TagExtractValueAndStrip<
      NestedRecord["inner"],
      "TestTag",
      "tag",
      "age"
    >;

    runTest<
      $TagExtractValueAndStrip<NestedRecord["inner"], "TestTag", "tag", "age">,
      {
        Stripped: { unrelatedKey: boolean };
        Value: 41;
      }
    >(
      {
        Stripped: { unrelatedKey: true },
        Value: 41,
      },
      {
        Stripped: { unrelatedKey: true },
        Value: 41,
      },
    );
  });
});
