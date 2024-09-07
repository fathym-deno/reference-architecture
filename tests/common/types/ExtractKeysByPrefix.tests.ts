// deno-lint-ignore-file ban-types
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { ExtractKeysByPrefix } from "../../../src/common/types/ExtractKeysByPrefix.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("ExtractKeysByPrefix Tests", async (t) => {
  await t.step("Basic Functionality Tests", async (t) => {
    await t.step("Default Prefix Extraction", () => {
      type Original = { $internal: string; external: number; config: boolean };
      type Extracted = ExtractKeysByPrefix<Original>;
      type Expected = { $internal: string };

      const check: Extracted = { $internal: "test" };
      assert(check);
      assertEquals(check, { $internal: "test" });

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Custom Prefix Extraction", () => {
      type Original = { __meta: string; data: number; user: boolean };
      type Extracted = ExtractKeysByPrefix<Original, "__">;
      type Expected = { __meta: string };

      const check: Extracted = { __meta: "metadata" };
      assert(check);
      assertEquals(check, { __meta: "metadata" });

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("No Properties with Prefix", () => {
      type Original = { a: string; b: number };
      type Extracted = ExtractKeysByPrefix<Original>;
      type Expected = {};

      const check: Extracted = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Union and Intersection Types", async (t) => {
    await t.step("Union Type", () => {
      type UnionType = { $internal: string } | { external: number };
      type Extracted = ExtractKeysByPrefix<UnionType>;
      type Expected = { $internal: string } | {};

      const check: Extracted = { $internal: "test" };
      assert(check);
      assertEquals(check, { $internal: "test" });

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Intersection Type", () => {
      type IntersectionType = { $internal: string } & {
        external: number;
        $meta: boolean;
      };
      type Extracted = ExtractKeysByPrefix<IntersectionType>;
      type Expected = { $internal: string; $meta: boolean };

      const check: Extracted = { $internal: "test", $meta: true };
      assert(check);
      assertEquals(check, { $internal: "test", $meta: true });

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("Empty Object", () => {
      type Original = {};
      type Extracted = ExtractKeysByPrefix<Original>;
      type Expected = {};

      const check: Extracted = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Optional Properties", () => {
      type Original = { $internal?: string; external: number };
      type Extracted = ExtractKeysByPrefix<Original>;
      type Expected = { $internal?: string };

      const check: Extracted = { $internal: "test" };
      assert(check);
      assertEquals(check, { $internal: "test" });

      type AssertTest = AssertEquals<Extracted, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });
});
