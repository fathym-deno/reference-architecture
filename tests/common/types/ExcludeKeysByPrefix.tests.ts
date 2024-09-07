// deno-lint-ignore-file ban-types
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { ExcludeKeysByPrefix } from "../../../src/common/types/ExcludeKeysByPrefix.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("Exclude Keys By Prefix Tests", async (t) => {
  // Basic Functionality Tests
  await t.step("Basic Functionality Tests", async (t) => {
    await t.step("Single Key Exclusion with Default Prefix ($)", () => {
      type Original = { $internal: string; external: number; config: boolean };
      type Excluded = ExcludeKeysByPrefix<Original>;
      type Expected = { external: number; config: boolean };

      const check: Excluded = { external: 42, config: true };
      assert(check);
      assertEquals(check, { external: 42, config: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Single Key Exclusion with Custom Prefix (__)", () => {
      type Original = { __meta: string; data: number; user: boolean };
      type Excluded = ExcludeKeysByPrefix<Original, "__">;
      type Expected = { data: number; user: boolean };

      const check: Excluded = { data: 42, user: true };
      assert(check);
      assertEquals(check, { data: 42, user: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Key Not in Type", () => {
      type Original = { a: string; b: number; c: boolean };
      type Excluded = ExcludeKeysByPrefix<Original, "_">;
      type Expected = { a: string; b: number; c: boolean };

      const check: Excluded = { a: "test", b: 42, c: true };
      assert(check);
      assertEquals(check, { a: "test", b: 42, c: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // Union and Intersection Types
  await t.step("Union and Intersection Types", async (t) => {
    await t.step("Union Type", () => {
      type UnionType = { a: string } | { $b: number };
      type Excluded = ExcludeKeysByPrefix<UnionType>;
      type Expected = { a: string } | {};

      const check: Excluded = { a: "test" };
      assert(check);
      assertEquals(check, { a: "test" });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Intersection Type", () => {
      type IntersectionType = { a: string } & { $b: number; c: boolean };
      type Excluded = ExcludeKeysByPrefix<IntersectionType>;
      type Expected = { a: string } & { c: boolean };

      const check: Excluded = { a: "test", c: true };
      assert(check);
      assertEquals(check, { a: "test", c: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // Edge Cases
  await t.step("Edge Cases", async (t) => {
    await t.step("Empty Type", () => {
      type EmptyType = {};
      // @ts-ignore Checking if non-existent property exists
      type Excluded = ExcludeKeysByPrefix<EmptyType>;
      type Expected = {};

      const check: Excluded = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("No Properties with Prefix", () => {
      type Original = { a: string; b: number };
      type Excluded = ExcludeKeysByPrefix<Original>;
      type Expected = { a: string; b: number };

      const check: Excluded = { a: "test", b: 42 };
      assert(check);
      assertEquals(check, { a: "test", b: 42 });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // Type Compatibility
  await t.step("Type Compatibility", async (t) => {
    await t.step("Exact Matching", () => {
      type Original = { a: string; $b: number; c: boolean };
      type Excluded = ExcludeKeysByPrefix<Original>;
      type Expected = { a: string; c: boolean };

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Non-Matching Keys", () => {
      type Original = { a: string; b: number; c: boolean };
      // @ts-ignore Checking if non-existent property exists
      type Excluded = ExcludeKeysByPrefix<Original, "_">;
      type Expected = { a: string; b: number; c: boolean };

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });
});
