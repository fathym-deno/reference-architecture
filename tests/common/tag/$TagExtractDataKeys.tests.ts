import { assert, assertEquals } from "../../test.deps.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import type { $TagExtractDataKeys } from "../../../src/common/tags/$TagExtractDataKeys.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

// Example $Tag types for testing
type TestTag = {
  "@TestTag-id": string;
  "@TestTag-name": string;
  otherKey: number;
};
type ComplexTag = {
  "@ComplexTag-key1": string;
  "@ComplexTag-key2": number;
  unrelatedKey: boolean;
};

Deno.test("Testing $TagExtractDataKeys", async (t) => {
  await t.step("Extract keys from simple tag", () => {
    runTest<$TagExtractDataKeys<TestTag, "TestTag">, "id" | "name">("id", "id");

    runTest<$TagExtractDataKeys<TestTag, "TestTag">, "id" | "name">(
      "name",
      "name",
    );
  });

  await t.step("Extract keys from complex tag", () => {
    runTest<$TagExtractDataKeys<ComplexTag, "ComplexTag">, "key1" | "key2">(
      "key1",
      "key1",
    );

    runTest<$TagExtractDataKeys<ComplexTag, "ComplexTag">, "key1" | "key2">(
      "key2",
      "key2",
    );
  });

  await t.step("Non-existent tag (returns never)", () => {
    runTest<$TagExtractDataKeys<TestTag, "NonExistentTag">, never>(
      undefined as never,
      undefined as never,
    );
  });

  await t.step("Nested records with tags", () => {
    type NestedRecord = { inner: TestTag };

    runTest<
      $TagExtractDataKeys<NestedRecord["inner"], "TestTag">,
      "id" | "name"
    >("id", "id");

    runTest<
      $TagExtractDataKeys<NestedRecord["inner"], "TestTag">,
      "id" | "name"
    >("name", "name");
  });

  await t.step("Handle union types with and without tags", () => {
    type MixedUnion = TestTag & { anotherKey: boolean };

    runTest<$TagExtractDataKeys<MixedUnion, "TestTag">, "id" | "name">(
      "id",
      "id",
    );

    runTest<$TagExtractDataKeys<MixedUnion, "TestTag">, "id" | "name">(
      "name",
      "name",
    );
  });

  await t.step("Tag Extract Data Keys", () => {
    type testTag = $TagValues<
      "Test",
      "Thing",
      "value" | "trim",
      { trim: "true"; value: "false" }
    >;

    type tagDataKeys = $TagExtractDataKeys<testTag, "Test">;

    const dataKeys: tagDataKeys = "trim";

    assert(dataKeys);
    assertEquals(dataKeys, "trim");
  });
});
