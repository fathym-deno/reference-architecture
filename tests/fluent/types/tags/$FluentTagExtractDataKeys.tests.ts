import { runTest } from "../../../../src/common/testing/runTest.ts";
import type { $FluentTagExtractDataKeys } from "../../../../src/fluent/types/tags/$FluentTagExtractDataKeys.ts";

// Example FluentTag types for testing
type TestFluentTag = {
  "@Methods-id": string;
  "@Methods-name": string;
  otherKey: number;
};

type ComplexFluentTag = {
  "@Methods-key1": string;
  "@Methods-key2": number;
  unrelatedKey: boolean;
};

Deno.test("Testing $FluentTagExtractDataKeys", async (t) => {
  // Simple case of extracting keys from a FluentTag
  await t.step("Extract keys from a simple FluentTag", () => {
    runTest<$FluentTagExtractDataKeys<TestFluentTag, "Methods">, "id" | "name">(
      "id",
      "id",
    );
    runTest<$FluentTagExtractDataKeys<TestFluentTag, "Methods">, "id" | "name">(
      "name",
      "name",
    );
  });

  // Extracting keys from a more complex FluentTag
  await t.step("Extract keys from a complex FluentTag", () => {
    runTest<
      $FluentTagExtractDataKeys<ComplexFluentTag, "Methods">,
      "key1" | "key2"
    >("key1", "key1");
    runTest<
      $FluentTagExtractDataKeys<ComplexFluentTag, "Methods">,
      "key1" | "key2"
    >("key2", "key2");
  });

  // Test handling non-existent FluentTags (should return never)
  await t.step("Non-existent FluentTag (returns never)", () => {
    // @ts-ignore Using this to confirm bad value don't work
    runTest<$FluentTagExtractDataKeys<TestFluentTag, "NonExistentTag">, never>(
      undefined as never,
      undefined as never,
    );
  });

  // Handling union types
  await t.step("Union type with FluentTag and other types", () => {
    type MixedUnion = TestFluentTag & { anotherKey: boolean };
    runTest<$FluentTagExtractDataKeys<MixedUnion, "Methods">, "id" | "name">(
      "id",
      "id",
    );
    runTest<$FluentTagExtractDataKeys<MixedUnion, "Methods">, "id" | "name">(
      "name",
      "name",
    );
  });

  // Nested record with FluentTag
  await t.step("Nested record with FluentTag", () => {
    type NestedRecord = { inner: TestFluentTag };
    runTest<
      $FluentTagExtractDataKeys<NestedRecord["inner"], "Methods">,
      "id" | "name"
    >("id", "id");
    runTest<
      $FluentTagExtractDataKeys<NestedRecord["inner"], "Methods">,
      "id" | "name"
    >("name", "name");
  });
});
