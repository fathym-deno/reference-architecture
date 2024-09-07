// deno-lint-ignore-file ban-types no-explicit-any
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { HasIndexSignatures } from "../../../src/common/types/HasIndexSignatures.ts";
import { assert, assertFalse } from "../../test.deps.ts";

Deno.test("HasIndexSignatures Tests", async (t) => {
  await t.step("Basic Functionality Tests", async (t) => {
    await t.step("Object with Index Signature", () => {
      type WithIndexSignature = { [key: string]: any; id: number };
      type HasIndex = HasIndexSignatures<WithIndexSignature, true>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Object without Index Signature", () => {
      type WithoutIndexSignature = { id: number; name: string };
      type HasIndex = HasIndexSignatures<WithoutIndexSignature, true>;
      type Expected = false;

      const check: HasIndex = false;
      assertFalse(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  await t.step("Union and Intersection Types", async (t) => {
    await t.step(
      "Union of Types with and without Index Signature (Match Any)",
      () => {
        type UnionType = { [key: string]: any } | { id: number };
        type HasIndex = HasIndexSignatures<UnionType, false>;
        type Expected = true; // because at least one type has an index signature

        const check: HasIndex = true;
        assert(check);

        type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
        const _assertTest: AssertTest = true;
        assert(_assertTest);
      },
    );

    await t.step(
      "Union of Types with and without Index Signature (Match All)",
      () => {
        type UnionType = { [key: string]: any } | { id: number };
        type HasIndex = HasIndexSignatures<UnionType, true>;
        type Expected = false; // because not all types have index signatures

        const check: HasIndex = false;
        assertFalse(check);

        type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
        const _assertTest: AssertTest = true;
        assert(_assertTest);
      },
    );

    await t.step("Intersection of Types", () => {
      type IntersectionType = { [key: string]: any } & { id: number };
      type HasIndex = HasIndexSignatures<IntersectionType>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // New Edge Cases
  await t.step("Edge Cases", async (t) => {
    await t.step("Empty Object", () => {
      type EmptyType = {};
      type HasIndex = HasIndexSignatures<EmptyType>;
      type Expected = false;

      const check: HasIndex = false;
      assertFalse(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Object with Optional Properties", () => {
      type OptionalType = { id?: number };
      type HasIndex = HasIndexSignatures<OptionalType>;
      type Expected = false;

      const check: HasIndex = false;
      assertFalse(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Mixed Explicit and Index Signatures", () => {
      type MixedType = { id: number } & Record<string, string>;
      type HasIndex = HasIndexSignatures<MixedType>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // New Record Types
  await t.step("Record Types", async (t) => {
    await t.step("Simple Record Type", () => {
      type RecordType = Record<string, string>;
      type HasIndex = HasIndexSignatures<RecordType>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Nested Record Type", () => {
      type NestedRecord = Record<string, Record<string, { id: number }>>;
      type HasIndex = HasIndexSignatures<NestedRecord>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Record with Different Key/Value Types", () => {
      type CustomRecord = Record<number, { name: string }>;
      type HasIndex = HasIndexSignatures<CustomRecord>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });

  // New Complex Union and Intersection Types
  await t.step("Complex Union and Intersection Types", async (t) => {
    await t.step("Union with Multiple Index Signatures", () => {
      type UnionType =
        | { [key: string]: any }
        | { [key: number]: any }
        | { id: number };
      type HasIndex = HasIndexSignatures<UnionType, false>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Intersection of Complex Types", () => {
      type IntersectionType = { [key: string]: any } & { id: number } & {
        name: string;
      };
      type HasIndex = HasIndexSignatures<IntersectionType>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });

    await t.step("Nested Union and Intersection", () => {
      type ComplexType = ({ [key: string]: any } | { id: number }) & {
        name: string;
      };
      type HasIndex = HasIndexSignatures<ComplexType>;
      type Expected = true;

      const check: HasIndex = true;
      assert(check);

      type AssertTest = AssertEquals<HasIndex, Expected>; // Expect: true
      const _assertTest: AssertTest = true;
      assert(_assertTest);
    });
  });
});
