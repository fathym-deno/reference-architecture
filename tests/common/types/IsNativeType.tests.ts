import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { IsNativeType } from "../../../src/common/types/IsNativeType.ts";
import { assert, assertFalse } from "../../test.deps.ts";

Deno.test("IsNativeType Extended Tests", async (t) => {
  // Test basic native types
  await t.step("Native Types", async (t) => {
    await t.step("ReadableStream Type", () => {
      type Result = IsNativeType<ReadableStream<string>>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("WritableStream Type", () => {
      type Result = IsNativeType<WritableStream<number>>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("TransformStream Type", () => {
      type Result = IsNativeType<TransformStream<number, string>>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Request Type", () => {
      type Result = IsNativeType<Request>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Response Type", () => {
      type Result = IsNativeType<Response>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Headers Type", () => {
      type Result = IsNativeType<Headers>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("URL Type", () => {
      type Result = IsNativeType<URL>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Blob Type", () => {
      type Result = IsNativeType<Blob>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("ArrayBuffer Type", () => {
      type Result = IsNativeType<ArrayBuffer>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("DataView Type", () => {
      type Result = IsNativeType<DataView>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Test array and tuple handling
  await t.step("Array and Tuple Handling", async (t) => {
    await t.step("Array of Native Types", () => {
      type Result = IsNativeType<Array<Date>>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Array of Non-Native Types", () => {
      type Result = IsNativeType<Array<{ a: string }>>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Tuple with Native Types", () => {
      type Result = IsNativeType<[Date, Promise<string>]>;
      type Expected = false; // Tuples themselves are not native types

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Test complex Record and Map types
  await t.step("Complex Types", async (t) => {
    await t.step("Record with Native Types", () => {
      type Result = IsNativeType<Record<string, Date>>;
      type Expected = false; // Record itself is not a native type

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Map Type", () => {
      type Result = IsNativeType<Map<string, number>>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Set Type", () => {
      type Result = IsNativeType<Set<number>>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  // Edge cases and primitives
  await t.step("Edge Cases and Primitives", async (t) => {
    await t.step("Custom Object Type", () => {
      type Result = IsNativeType<{ a: string }>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Non-Native Primitive Type", () => {
      type Result = IsNativeType<string>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Native Primitive Type", () => {
      type Result = IsNativeType<number>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });
});
