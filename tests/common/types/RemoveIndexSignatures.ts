// deno-lint-ignore-file ban-types no-explicit-any
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { RemoveIndexSignatures } from "../../../src/common/types/RemoveIndexSignatures.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("RemoveIndexSignatures Tests", async (t) => {
  await t.step("Basic Functionality Tests", async (t) => {
    await t.step("Remove String Index Signature", () => {
      type Original = { [key: string]: any; id: number; name: string };
      type Cleaned = RemoveIndexSignatures<Original>;
      type Expected = { id: number; name: string };

      const check: Cleaned = { id: 1, name: "John" };
      assert(check);
      assertEquals(check, { id: 1, name: "John" });

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Remove Symbol Index Signature", () => {
      type Original = { [key: symbol]: any; name: string };
      type Cleaned = RemoveIndexSignatures<Original>;
      type Expected = { name: string };

      const check: Cleaned = { name: "John" };
      assert(check);
      assertEquals(check, { name: "John" });

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Testing with Record Types", async (t) => {
    await t.step("Simple Record Type", () => {
      type RecordType = Record<string, string>;
      type Cleaned = RemoveIndexSignatures<RecordType>;
      type Expected = {};

      const check: Cleaned = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Complex Record Type", () => {
      type ComplexRecord = Record<string, { a: number; b: string }>;
      type Cleaned = RemoveIndexSignatures<ComplexRecord>;
      type Expected = {};

      const check: Cleaned = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Nested Record Type", () => {
      type NestedRecord = Record<string, Record<string, { id: number }>>;
      type Cleaned = RemoveIndexSignatures<NestedRecord>;
      type Expected = {};

      const check: Cleaned = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Mixed Explicit and Index Signatures", () => {
      // Updated MixedType with nested Record structure
      type MixedType = Record<string, Record<string, { GotMilk: boolean }>>;

      // We expect the explicitly defined key 'id' to remain, while index signatures are removed
      type Cleaned = RemoveIndexSignatures<MixedType>;
      type Expected = {};

      // Validation check at runtime
      const check: Cleaned = {};
      assert(check);
      assertEquals(check, {});

      // Type assertion to ensure Cleaned matches the Expected type
      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("No Index Signature", () => {
      type Original = { id: number; name: string };
      type Cleaned = RemoveIndexSignatures<Original>;
      type Expected = { id: number; name: string };

      const check: Cleaned = { id: 1, name: "John" };
      assert(check);
      assertEquals(check, { id: 1, name: "John" });

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Only Index Signature", () => {
      type Original = { [key: string]: any };
      type Cleaned = RemoveIndexSignatures<Original>;
      type Expected = {};

      const check: Cleaned = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Cleaned, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });
});
