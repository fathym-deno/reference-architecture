import type { $FluentTagStrip } from "../../../../src/fluent/types/tags/$FluentTagStrip.ts";
import { runTest } from "../../../../src/common/types/testing/runTest.ts";

Deno.test("Testing $FluentTagStrip", async (t) => {
  // Basic Test: Strip a single FluentTag
  await t.step("Strip a single FluentTag", () => {
    type TestTag = {
      "@Methods-handlers": { save: () => void };
      unrelatedKey: string;
    };

    // runTest<
    //   $FluentTagStrip<TestTag, "Methods", "Object", "handlers">,
    //   { unrelatedKey: string; "@Methods-handlers": { save: () => void } }
    // >(
    //   { unrelatedKey: "test", "@Methods-handlers": { save: () => {} } },
    //   { unrelatedKey: "test", "@Methods-handlers": { save: () => {} } },
    // );
  });

  // Test: Remove all FluentTags of a type
  await t.step("Remove all FluentTags of a type", () => {
    type TestTag = {
      "@Methods-handlers": { save: () => void };
      "@Methods-generic": true;
      unrelatedKey: boolean;
    };

    runTest<$FluentTagStrip<TestTag, "Methods">, { unrelatedKey: boolean }>(
      { unrelatedKey: true },
      { unrelatedKey: true },
    );
  });

  // Test: Strip exact FluentTag metadata
  await t.step("Strip exact FluentTag metadata", () => {
    type TestTag = {
      "@Methods-handlers": { save: () => void };
      "@Methods-generic": boolean;
      unrelatedKey: number;
    };

    runTest<
      $FluentTagStrip<TestTag, "Methods", never, "handlers", true>,
      { "@Methods-generic": boolean; unrelatedKey: number }
    >(
      { "@Methods-generic": true, unrelatedKey: 42 },
      { "@Methods-generic": true, unrelatedKey: 42 },
    );
  });

  // Test: Handle nested Record with FluentTags
  await t.step("Handle nested Record with FluentTags", () => {
    type NestedRecord = {
      inner: {
        "@Methods-handlers": { log: () => void };
        unrelatedKey: boolean;
      };
    };

    runTest<
      $FluentTagStrip<NestedRecord["inner"], "Methods">,
      { unrelatedKey: boolean }
    >({ unrelatedKey: true }, { unrelatedKey: true });
  });

  // Test: Union type with one tagged and one untagged
  await t.step("Union type with one tagged and one untagged", () => {
    type MixedUnion = {
      "@Methods-handlers": { save: () => void };
      unrelatedKey: boolean;
    } & { key: string };

    runTest<
      $FluentTagStrip<MixedUnion, "Methods">,
      { unrelatedKey: boolean } & { key: string }
    >({ unrelatedKey: true, key: "hey" }, { unrelatedKey: true, key: "hey" });
  });

  // Test: Nested array of tagged objects
  await t.step("Strip FluentTag from array of tagged objects", () => {
    type ArrayOfTags = Array<{
      "@Methods-handlers": { save: () => void };
      unrelatedKey: number;
    }>;

    runTest<
      $FluentTagStrip<ArrayOfTags[0], "Methods">,
      { unrelatedKey: number }
    >({ unrelatedKey: 100 }, { unrelatedKey: 100 });
  });

  // Test: Handle intersection type with FluentTag
  await t.step("Intersection type with FluentTag", () => {
    type IntersectionTag = {
      "@Methods-handlers": { save: () => void };
      unrelatedKey: string;
    } & { commonKey: boolean };

    runTest<
      $FluentTagStrip<IntersectionTag, "Methods">,
      { unrelatedKey: string; commonKey: boolean }
    >(
      { unrelatedKey: "test", commonKey: true },
      { unrelatedKey: "test", commonKey: true },
    );
  });

  // Test: Remove FluentTags with mixed values
  await t.step("Strip mixed FluentTag values", () => {
    type MixedTags = {
      "@Methods-handlers": { save: () => void };
      "@Methods-generic": boolean;
      unrelatedKey: string;
    };

    runTest<$FluentTagStrip<MixedTags, "Methods">, { unrelatedKey: string }>(
      { unrelatedKey: "example" },
      { unrelatedKey: "example" },
    );
  });
});
