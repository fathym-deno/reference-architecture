import type { $TagStrip } from "../../../src/common/tags/$TagStrip.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/testing/runTest.ts";
import { assert, assertEquals, assertFalse } from "../../test.deps.ts";

Deno.test("Testing $TagStrip", async (t) => {
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

  await t.step("Strip all TestTag metadata", () => {
    runTest<$TagStrip<TestTag, "TestTag">, { unrelatedKey: boolean }>(
      { unrelatedKey: true },
      { unrelatedKey: true },
    );
  });

  await t.step("Strip exact TestTag-name metadata", () => {
    runTest<
      $TagStrip<TestTag, "TestTag", never, "name", true>,
      {
        "@TestTag-age": 41;
        unrelatedKey: boolean;
      }
    >(
      { unrelatedKey: true, "@TestTag-age": 41 },
      { unrelatedKey: true, "@TestTag-age": 41 },
    );
  });

  await t.step("Handle case with no tags (return unchanged)", () => {
    type NoTagData = { key1: string; key2: number };
    runTest<$TagStrip<NoTagData, "NonExistentTag">, NoTagData>(
      { key1: "value", key2: 123 },
      { key1: "value", key2: 123 },
    );
  });

  await t.step("Union type with one tagged and one untagged", () => {
    type MixedUnion = TestTag | { key: string };
    runTest<
      $TagStrip<MixedUnion, "TestTag">,
      { unrelatedKey: boolean } | { key: string }
    >({ unrelatedKey: true }, { unrelatedKey: true });
  });

  await t.step("Nested Record with tags", () => {
    type NestedRecord = { inner: TestTag };
    runTest<
      $TagStrip<NestedRecord["inner"], "TestTag">,
      { unrelatedKey: boolean }
    >({ unrelatedKey: true }, { unrelatedKey: true });
  });

  await t.step("Tag Stripped", () => {
    type tagStripped1 = $TagStrip<TestTag, "TestTag">;

    const stripped1: tagStripped1 = {
      unrelatedKey: true,
    };

    assert(stripped1);

    type tagStripped2 = $TagStrip<TestTag, "TestTag", "tag", "name", true>;

    const stripped2: tagStripped2 = {
      unrelatedKey: true,
      "@TestTag": "tag",
      "@TestTag-age": 41,
    };

    assert(stripped2);
    assertEquals(stripped2["@TestTag"], "tag");
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(!!stripped2["@TestTag-name"]);
    assertEquals(stripped2["@TestTag-age"], 41);

    type tagStripped3 = $TagStrip<
      TestTag,
      "TestTag",
      "tag",
      "name" | "age",
      true
    >;

    const stripped3: tagStripped3 = {
      unrelatedKey: true,
      "@TestTag": "tag",
    };

    assert(stripped3);
    assertEquals(stripped3["@TestTag"], "tag");
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(!!stripped3["@TestTag-name"]);
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(!!stripped3["@TestTag-age"]);

    type tagStripped4 = $TagStrip<TestTag, "TestTag", "tag", never, true>;

    const stripped4: tagStripped4 = {
      unrelatedKey: true,
      "@TestTag-name": "Pete",
      "@TestTag-age": 41,
    };

    assert(stripped4);
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(!!stripped4["@TestTag"]);
    assertEquals(stripped4["@TestTag-name"], "Pete");
    assertEquals(stripped4["@TestTag-age"], 41);
  });
});
