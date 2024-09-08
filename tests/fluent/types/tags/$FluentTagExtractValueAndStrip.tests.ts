// deno-lint-ignore-file no-explicit-any
import { runTest } from "../../../../src/common/types/testing/runTest.ts";
import type { $FluentTagExtractValueAndStrip } from "../../../../src/fluent/types/tags/$FluentTagExtractValueAndStrip.ts";

Deno.test("Testing $FluentTagExtractValueAndStrip", async (t) => {
  // Basic test for extracting and stripping from FluentTag
  await t.step("Extract and Strip Basic FluentTag", () => {
    type TestTag = {
      "@Methods": "Object";
      "@Methods-generic": boolean;
      unrelatedKey: string;
    };

    runTest<
      $FluentTagExtractValueAndStrip<TestTag, "Methods", "Object", "generic">,
      {
        Stripped: { unrelatedKey: string };
        Value: boolean;
      }
    >(
      {
        Stripped: { unrelatedKey: "value" },
        Value: true,
      },
      {
        Stripped: { unrelatedKey: "value" },
        Value: true,
      },
    );
  });

  // Test with Record type in the value
  await t.step("Extract and Strip with Record Type", () => {
    type RecordTag = {
      "@Methods": "Record";
      "@Methods-handlers": Record<string, (...args: any[]) => void>;
      unrelatedKey: number;
    };

    runTest<
      $FluentTagExtractValueAndStrip<
        RecordTag,
        "Methods",
        "Record",
        "handlers"
      >,
      {
        Stripped: { unrelatedKey: number };
        Value: Record<string, (...args: any[]) => void>;
      }
    >(
      {
        Stripped: { unrelatedKey: 42 },
        Value: { save: () => {} },
      },
      {
        Stripped: { unrelatedKey: 42 },
        Value: { save: () => {} },
      },
    );
  });

  // Test with nested Record and complex object structures
  await t.step("Extract and Strip with Nested Complex Structure", () => {
    type ComplexTag = {
      "@Methods": "Record";
      "@Methods-handlers": Record<string, Record<string, number>>;
      unrelatedKey: string;
    };

    runTest<
      $FluentTagExtractValueAndStrip<
        ComplexTag,
        "Methods",
        "Record",
        "handlers"
      >,
      {
        Stripped: { unrelatedKey: string };
        Value: Record<string, Record<string, number>>;
      }
    >(
      {
        Stripped: { unrelatedKey: "nested" },
        Value: { outer: { inner: 10 } },
      },
      {
        Stripped: { unrelatedKey: "nested" },
        Value: { outer: { inner: 10 } },
      },
    );
  });

  // Edge case where tag doesn't exist
  await t.step("Handle Non-existent Tag", () => {
    type NoTag = {
      unrelatedKey: string;
    };

    runTest<
      $FluentTagExtractValueAndStrip<NoTag, "Methods", "Object", "generic">,
      {
        Stripped: { unrelatedKey: string };
        Value: never;
      }
    >(
      {
        Stripped: { unrelatedKey: "value" },
        Value: undefined as never,
      },
      {
        Stripped: { unrelatedKey: "value" },
        Value: undefined as never,
      },
    );
  });

  // Test with union types
  await t.step("Handle Union Types in FluentTag", () => {
    type UnionTag = {
      "@Methods": "Object";
      "@Methods-generic": boolean;
    };

    runTest<
      $FluentTagExtractValueAndStrip<UnionTag, "Methods", "Object", "generic">,
      {
        Stripped: { unrelatedKey?: number };
        Value: boolean;
      }
    >(
      {
        Stripped: {},
        Value: true,
      },
      {
        Stripped: {},
        Value: true,
      },
    );
  });
});
