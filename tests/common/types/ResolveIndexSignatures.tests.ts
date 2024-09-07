// deno-lint-ignore-file ban-types no-explicit-any
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { ResolveIndexSignatures } from "../../../src/common/types/ResolveIndexSignatures.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("ResolveIndexSignatures Tests", async (t) => {
  await t.step("Basic Functionality Tests", async (t) => {
    await t.step("Index Signature Retention", () => {
      type Original = { [key: string]: any; id: number; name: string };
      type Resolved = ResolveIndexSignatures<Original>;
      type Expected = { [key: string]: any };

      const check: Resolved = { someKey: "test" };
      assert(check);
      assertEquals(check, { someKey: "test" });

      type AssertTest = AssertEquals<Resolved, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  await t.step("Testing with Record Types", async (t) => {
    await t.step("Simple Record Type", () => {
      type RecordType = Record<string, string>;
      type Resolved = ResolveIndexSignatures<RecordType>;
      type Expected = Record<string, string>;

      const check: Resolved = { key: "value" };
      assert(check);
      assertEquals(check, { key: "value" });

      type AssertTest = AssertEquals<Resolved, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Complex Record Type", () => {
      type ComplexRecord = Record<string, { a: number; b: string }>;
      type Resolved = ResolveIndexSignatures<ComplexRecord>;
      type Expected = Record<string, { a: number; b: string }>;

      const check: Resolved = { key: { a: 1, b: "text" } };
      assert(check);
      assertEquals(check, { key: { a: 1, b: "text" } });

      type AssertTest = AssertEquals<Resolved, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Mixed Explicit and Index Signature", () => {
      type MixedType = { id: number; data: Record<string, string> };
      type Resolved = ResolveIndexSignatures<MixedType>;
      type Expected = Record<string, string>;

      const check: Resolved = { key: "value" };
      assert(check);
      assertEquals(check, { key: "value" });

      type AssertTest = AssertEquals<Resolved, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("No Index Signature", () => {
      type Original = { id: number; name: string };
      type Resolved = ResolveIndexSignatures<Original>;
      type Expected = {};

      const check: Resolved = {};
      assert(check);
      assertEquals(check, {});

      type AssertTest = AssertEquals<Resolved, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });
});
