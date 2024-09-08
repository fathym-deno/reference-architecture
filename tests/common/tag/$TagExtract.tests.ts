import type { $Tag } from "../../../src/common/tags/$Tag.ts";
import type { $TagExtract } from "../../../src/common/tags/$TagExtract.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("Testing $TagExtract", async (t) => {
  type TestTag = $Tag<"TestTag", "tag">;
  type ComplexTag = $Tag<"ComplexTag", { nested: "nested"; value: 1 }>;

  await t.step("Extract simple tag value", () => {
    runTest<$TagExtract<TestTag, "TestTag">, "tag">("tag", "tag");
  });

  await t.step("Non-existent tag (returns never)", () => {
    runTest<$TagExtract<TestTag, "NonExistentTag">, never>(
      undefined as never,
      undefined as never,
    );
  });

  await t.step("Extract complex tag value", () => {
    runTest<
      $TagExtract<ComplexTag, "ComplexTag">,
      { nested: "nested"; value: 1 }
    >({ nested: "nested", value: 1 }, { nested: "nested", value: 1 });
  });

  await t.step("Handle nested records with tags", () => {
    type NestedRecord = Record<string, $Tag<"NestedTag", 1>>;
    runTest<$TagExtract<NestedRecord["key"], "NestedTag">, 1>(1, 1);
  });

  await t.step("Array of tagged objects", () => {
    type TaggedArray = $Tag<"ArrayTag", "tag">[];
    runTest<$TagExtract<TaggedArray[0], "ArrayTag">, "tag">("tag", "tag");
  });

  await t.step("Edge case: undefined properties", () => {
    type UndefinedTag = $Tag<"UndefinedTag", undefined>;
    runTest<$TagExtract<UndefinedTag, "UndefinedTag">, never>(
      undefined as never,
      undefined as never,
    );
  });
});
