import type { $TagExtract } from "../../../src/common/tags/$TagExtract.ts";
import type { $TagExtractValue } from "../../../src/common/tags/$TagExtractValue.ts";
import type { $TagExtractValues } from "../../../src/common/tags/$TagExtractValues.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("Testing $TagExtractValues", async (t) => {
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

  await t.step("Extract tag values", () => {
    runTest<
      $TagExtractValues<TestTag, "TestTag", "name" | "age">,
      {
        TestTag: {
          name: "Pete";
          age: 41;
        };
      }
    >(
      {
        TestTag: {
          name: "Pete",
          age: 41,
        },
      },
      {
        TestTag: {
          name: "Pete",
          age: 41,
        },
      },
    );
  });

  await t.step("Missing tag returns never", () => {
    runTest<
      $TagExtractValues<TestTag, "MissingTag", "name">,
      {
        MissingTag: { name: never };
      }
    >(
      {
        MissingTag: { name: undefined as never },
      },
      {
        MissingTag: { name: undefined as never },
      },
    );
  });

  await t.step("Union type with one tag", () => {
    type MixedUnion = TestTag & { unrelatedKey: boolean };
    runTest<
      $TagExtractValues<MixedUnion, "TestTag", "name">,
      {
        TestTag: { name: "Pete" };
      }
    >(
      {
        TestTag: { name: "Pete" },
      },
      {
        TestTag: { name: "Pete" },
      },
    );
  });

  await t.step("Nested records with tags", () => {
    type NestedRecord = { inner: TestTag };
    runTest<
      $TagExtractValues<NestedRecord["inner"], "TestTag", "name">,
      {
        TestTag: { name: "Pete" };
      }
    >(
      {
        TestTag: { name: "Pete" },
      },
      {
        TestTag: { name: "Pete" },
      },
    );
  });

  await t.step("Tag Extracts", () => {
    type tag = $TagExtract<TestTag, "TestTag">;

    const tagged: tag = "tag";

    assert(tagged);
    assertEquals(tagged, "tag");

    type tagValue = $TagExtractValue<TestTag, "TestTag", "age">;

    type tagValueCheck = tagValue extends 41 ? true : false;

    const value: tagValueCheck = true;

    assertEquals(value, true);

    type tagValues = $TagExtractValues<TestTag, "TestTag", "name" | "age">;

    type tagValueChecks = {
      [KValue in keyof tagValues]: {
        [K in keyof tagValues[KValue]]: K extends "name"
          ? tagValues[KValue]["name"] extends "Pete" ? true
          : false
          : K extends "age" ? tagValues[KValue]["age"] extends 41 ? true
            : false
          : false;
      };
    };

    const values: tagValueChecks = {
      TestTag: {
        name: true,
        age: true,
      },
    };

    assert(values?.TestTag?.name);
    assert(values?.TestTag?.age);
  });

  await t.step("Tag Record Extracts", () => {
    type recordTest =
      & Record<
        string,
        {
          BringIt: boolean;
        }
      >
      & TestTag;

    type tag = $TagExtract<recordTest, "TestTag">;

    const tagged: tag = "tag";

    assert(tagged);
    assertEquals(tagged, "tag");

    type tagValue = $TagExtractValue<recordTest, "TestTag", "name">;

    const value: tagValue = "Pete";

    assertEquals(value, "Pete");

    type tagValues = $TagExtractValues<
      recordTest,
      "TestTag",
      "name" | "age"
    >;

    const values: tagValues = {
      TestTag: {
        name: "Pete",
        age: 41,
      },
    };

    assert(values?.TestTag?.name);
    assert(values?.TestTag?.age);
    assertEquals(values?.TestTag?.name, "Pete");
    assertEquals(values?.TestTag?.age, 41);
  });
});
