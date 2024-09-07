// deno-lint-ignore-file ban-types
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { ExcludeKeys } from "../../../src/common/types/ExcludeKeys.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("Exclude Keys Tests", async (t) => {
  await t.step("ExcludeKeys Basic Functionality Tests", async (t) => {
    await t.step("Single Key Exclusion", () => {
      type Original = { a: string; b: number; c: boolean };
      type Excluded = ExcludeKeys<Original, "b">;
      type Expected = { a: string; c: boolean };

      const check: Excluded = { a: "test", c: true };
      assert(check);
      assertEquals(check, { a: "test", c: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Multiple Key Exclusions", () => {
      type Original = { a: string; b: number; c: boolean; d: string };
      type Excluded = ExcludeKeys<Original, "b" | "c">;
      type Expected = { a: string; d: string };

      const check: Excluded = { a: "test", d: "data" };
      assert(check);
      assertEquals(check, { a: "test", d: "data" });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Key Not in Type", () => {
      type Original = { a: string; b: number; c: boolean };
      type Excluded = ExcludeKeys<Original, "d">;
      type Expected = { a: string; b: number; c: boolean };

      const check: Excluded = { a: "test", b: 42, c: true };
      assert(check);
      assertEquals(check, { a: "test", b: 42, c: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("ExcludeKeys Union and Intersection Types", async (t) => {
    await t.step("Union Type", () => {
      type UnionType = { a: string } | { b: number };

      type Excluded = ExcludeKeys<UnionType, "b">;

      type Expected = { a: string } | {};

      const check: Excluded = { a: "test" };
      assert(check);
      assertEquals(check, { a: "test" });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Intersection Type", () => {
      type IntersectionType = { a: string } & { b: number; c: boolean };
      type Excluded = ExcludeKeys<IntersectionType, "b">;
      type Expected = { a: string } & { c: boolean };

      const check: Excluded = { a: "test", c: true };
      assert(check);
      assertEquals(check, { a: "test", c: true });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("ExcludeKeys Edge Cases", async (t) => {
    await t.step("Empty Type", () => {
      type EmptyType = {};
      // @ts-ignore Checking if non-existant property exists
      type Excluded = ExcludeKeys<EmptyType, "a">;
      type Expected = {};

      const check: Excluded = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Optional Property", () => {
      type WithOptional = { a?: string; b: number };
      type Excluded = ExcludeKeys<WithOptional, "a">;
      type Expected = { b: number };

      const check: Excluded = { b: 42 };
      assert(check);
      assertEquals(check, { b: 42 });

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("ExcludeKeys Type Compatibility", async (t) => {
    await t.step("Exact Matching", () => {
      type Original = { a: string; b: number; c: boolean };
      type Excluded = ExcludeKeys<Original, "b">;
      type Expected = { a: string; c: boolean };

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true

      // Validate at runtime
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Non-Matching Keys", () => {
      type Original = { a: string; b: number; c: boolean };
      // @ts-ignore Checking if non-existant property exists
      type Excluded = ExcludeKeys<Original, "d">;
      type Expected = { a: string; b: number; c: boolean };

      type AssertTest = AssertEquals<Excluded, Expected>; // Expect: true

      // Validate at runtime
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });
});
