// deno-lint-ignore-file ban-types
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { NoPropertiesUndefined } from "../../../src/common/types/NoPropertiesUndefined.ts";
import { assert } from "../../test.deps.ts";

Deno.test("NoPropertiesUndefined Tests", async (t) => {
  // Basic Functionality
  await t.step("Basic Functionality", async (t) => {
    await t.step("Simple Object", () => {
      type Original = { a: string | undefined; b: number | null };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: string; b: number };

      const check: Result = { a: "test", b: 42 };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Nested Object", () => {
      type Original = { a: { b: string | undefined; c: null } };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: { b: string; c: never } };

      const check: Result = {
        a: {
          b: "test",
          // @ts-ignore using this to confirm proper functionality
          c: undefined,
        },
      };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Array Handling
  await t.step("Array Handling", async (t) => {
    await t.step("Array of Objects", () => {
      type Original = { a: Array<{ b: string | undefined }> };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: Array<{ b: string }> };

      const check: Result = { a: [{ b: "test" }] };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Array of Primitives", () => {
      type Original = { a: (string | undefined)[] };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: string[] };

      const check: Result = { a: ["test"] };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Nested Array", () => {
      type Original = { a: Array<Array<{ b: number | undefined }>> };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: Array<Array<{ b: number }>> };

      const check: Result = { a: [[{ b: 42 }]] };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Tuple Handling
  await t.step("Tuple Handling", async (t) => {
    await t.step("Simple Tuple", () => {
      type Original = [string | undefined, number | null];
      type Result = NoPropertiesUndefined<Original>;
      type Expected = [string, number];

      const check: Result = ["test", 42];
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Tuple with Objects", () => {
      type Original = [{ a: string | undefined }, { b: number | null }];
      type Result = NoPropertiesUndefined<Original>;
      type Expected = [{ a: string }, { b: number }];

      const check: Result = [{ a: "test" }, { b: 42 }];
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Tuple with Mixed Types", () => {
      type Original = [
        string | undefined,
        { a: number | null }[],
        boolean | null,
      ];
      type Result = NoPropertiesUndefined<Original>;
      type Expected = [string, { a: number }[], boolean];

      const check: Result = ["test", [{ a: 42 }], true];
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Native Types
  await t.step("Native Type Handling", async (t) => {
    await t.step("Date Object", () => {
      type Original = { date: Date | undefined };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { date: Date };

      const check: Result = { date: new Date() };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Promise Type", () => {
      type Original = { a: Promise<string | undefined> | undefined };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: Promise<string> };

      const check: Result = { a: Promise.resolve("test") };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Edge Cases
  await t.step("Edge Cases", async (t) => {
    await t.step("Empty Object", () => {
      type Original = {};
      type Result = NoPropertiesUndefined<Original>;
      type Expected = {};

      const check: Result = {};
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Optional Properties", () => {
      type Original = { a?: string | undefined; b: number | undefined };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: string; b: number };

      const check: Result = { a: "test", b: 42 };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Complex Nested Object", () => {
      type Original = {
        a?: string | undefined;
        b: {
          c: { d: { e: number | undefined } } | null;
        };
      };
      type Result = NoPropertiesUndefined<Original>;
      type Expected = { a: string; b: { c: { d: { e: number } } } };

      const check: Result = { a: "test", b: { c: { d: { e: 42 } } } };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Advanced Complex Types
  await t.step("Advanced Complex Types", async (t) => {
    await t.step("Array of Tuples", () => {
      type Original = [string | undefined, number | null][];
      type Result = NoPropertiesUndefined<Original>;
      type Expected = [string, number][];

      const check: Result = [["test", 42]];
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Record Type", () => {
      type Original = Record<string, string | undefined>;
      type Result = NoPropertiesUndefined<Original>;
      type Expected = Record<string, string>;

      const check: Result = { key: "value" };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Record of Records", () => {
      type Original = Record<string, Record<string, { id: number | null }>>;
      type Result = NoPropertiesUndefined<Original>;
      type Expected = Record<string, Record<string, { id: number }>>;

      const check: Result = { outer: { inner: { id: 1 } } };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Array of Records", () => {
      type Original = Record<string, { a: string | undefined }[]>;
      type Result = NoPropertiesUndefined<Original>;
      type Expected = Record<string, { a: string }[]>;

      const check: Result = { key: [{ a: "test" }] };
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });
});
