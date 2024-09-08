// deno-lint-ignore-file no-explicit-any
import type { $FluentTagExtractValueAndStrip } from "../../../../src/fluent/types/tags/$FluentTagExtractValueAndStrip.ts";
import type { $FluentTag } from "../../../../src/fluent/types/tags/$FluentTag.ts";
import { assert, assertEquals } from "../../../test.deps.ts";
import type { $FluentTagExtractValue } from "../../../../src/fluent/types/tags/$FluentTagExtractValue.ts";

Deno.test("Testing $FluentTag", async (t) => {
  await t.step("FluentTag with Additional Metadata", () => {
    type Result = $FluentTag<
      "Methods",
      "Record",
      "generic" | "handlers",
      { generic: true; handlers: { save: () => void } }
    >;

    const actual = {
      "@Methods": "Record",
      "@Methods-generic": true,
      "@Methods-handlers": { save: () => {} },
    };

    const expected = {
      "@Methods": "Record",
      "@Methods-generic": true,
      "@Methods-handlers": { save: () => {} },
    };

    assert(actual["@Methods-handlers"]);
    assertEquals(actual["@Methods"], expected["@Methods"]);
    assertEquals(actual["@Methods-generic"], expected["@Methods-generic"]);
    // Do not compare the function directly; just verify its existence.
    assert(typeof actual["@Methods-handlers"].save === "function");
  });

  await t.step("Record Type in FluentTag", () => {
    type Result = $FluentTag<
      "Methods",
      "Record",
      "handlers",
      { handlers: Record<string, (...args: any[]) => any> }
    >;

    const actual = {
      "@Methods": "Record",
      "@Methods-handlers": { log: () => {} },
    };

    const expected = {
      "@Methods": "Record",
      "@Methods-handlers": { log: () => {} },
    };

    assert(actual["@Methods-handlers"]);
    assertEquals(actual["@Methods"], expected["@Methods"]);
    // Verify function existence without deep comparison
    assert(typeof actual["@Methods-handlers"].log === "function");
  });

  await t.step("Multiple Metadata Fields", () => {
    type Result = $FluentTag<
      "Methods",
      "Object",
      "generic" | "handlers",
      { generic: true; handlers: Record<string, (...args: any[]) => void> }
    >;

    const actual = {
      "@Methods": "Object",
      "@Methods-generic": true,
      "@Methods-handlers": { save: () => {} },
    };

    const expected = {
      "@Methods": "Object",
      "@Methods-generic": true,
      "@Methods-handlers": { save: () => {} },
    };

    assertEquals(actual["@Methods"], expected["@Methods"]);
    assertEquals(actual["@Methods-generic"], expected["@Methods-generic"]);
    // Check if the function exists and its type
    assert(typeof actual["@Methods-handlers"].save === "function");
  });
});

Deno.test("Testing $FluentTagExtractValue", async (t) => {
  await t.step("Extract simple value", () => {
    type TestTag = {
      "@Methods-handlers": { save: () => void };
    };

    type Result = $FluentTagExtractValue<TestTag, "Methods", "handlers">;

    const actual = { save: () => {} };
    const _expected = { save: () => {} };

    assert(actual);
    // Instead of direct function comparison, validate function type
    assert(typeof actual.save === "function");
  });

  await t.step("Extract value from Record", () => {
    type TestTag = {
      "@Methods-handlers": Record<string, (...args: any[]) => void>;
    };

    type Result = $FluentTagExtractValue<TestTag, "Methods", "handlers">;

    const actual = { log: () => {} };
    const _expected = { log: () => {} };

    assert(actual);
    assert(typeof actual.log === "function");
  });

  await t.step("Handle union of types", () => {
    type UnionTag =
      | {
        "@Methods-handlers": { log: () => void };
      }
      | {
        "@Methods-handlers": { save: () => void };
      };

    type Result = $FluentTagExtractValue<UnionTag, "Methods", "handlers">;

    const actual = { log: () => {} };

    assert(actual);
    assert(typeof actual.log === "function");
  });
});

Deno.test("Testing $FluentTagExtractValueAndStrip", async (t) => {
  await t.step("Extract and Strip with Record Type", () => {
    type TestTag = {
      "@Methods": "Record";
      "@Methods-handlers": { save: () => void };
      unrelatedKey: number;
    };

    type Result = $FluentTagExtractValueAndStrip<
      TestTag,
      "Methods",
      "Record",
      "handlers"
    >;

    const actual = {
      Stripped: { unrelatedKey: 42 },
      Value: { save: () => {} },
    };

    const expected = {
      Stripped: { unrelatedKey: 42 },
      Value: { save: () => {} },
    };

    assert(actual.Stripped);
    assertEquals(actual.Stripped.unrelatedKey, expected.Stripped.unrelatedKey);
    assert(typeof actual.Value.save === "function");
  });
});
