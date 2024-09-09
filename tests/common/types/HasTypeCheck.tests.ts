// deno-lint-ignore-file no-explicit-any
import type { AssertEquals } from "../../../src/common/.exports.ts";
import type { HasTypeCheck } from "../../../src/common/types/HasTypeCheck.ts";
import { assert, assertFalse } from "../../test.deps.ts";

Deno.test("HasTypeCheck Extended Tests", async (t) => {
  await t.step("Basic Match Any and All", async (t) => {
    await t.step(
      "At least one type extends the target type (Match Any)",
      () => {
        type UnionType = { a: string } | { b: number };
        type Result = HasTypeCheck<UnionType, { a: string }, false>;
        type Expected = true;

        const check: Result = true;
        assert(check);

        type AssertTest = AssertEquals<Result, Expected>; // Expect: true
        const assertTest: AssertTest = true;
        assert(assertTest);
      },
    );

    await t.step("All types must extend the target type (Match All)", () => {
      type UnionType = { a: string } | { b: number };
      type Result = HasTypeCheck<UnionType, { a: string }, true>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Intersection Types", async (t) => {
    await t.step("Intersection of two types (exact match)", () => {
      type IntersectionType = { a: string } & { b: number };
      type Result = HasTypeCheck<
        IntersectionType,
        { a: string; b: number },
        true
      >;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Intersection that does not match the target", () => {
      type IntersectionType = { a: string } & { b: number };
      type Result = HasTypeCheck<IntersectionType, { ab: string }, true>;
      type Expected = false;

      const check: Result = false;
      assertFalse(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Arrays and Tuples", async (t) => {
    await t.step(
      "Array of objects extending the target type (Match Any)",
      () => {
        type ArrayType = Array<{ a: string } | { b: number }>;
        type Result = HasTypeCheck<
          ArrayType,
          Array<{ a: string } | { b: number }>,
          false
        >;
        type Expected = true;

        const check: Result = true;
        assert(check);

        type AssertTest = AssertEquals<Result, Expected>; // Expect: true
        const assertTest: AssertTest = true;
        assert(assertTest);
      },
    );

    await t.step("Tuple where all types extend the target (Match All)", () => {
      type TupleType = [{ a: string }, { b: number }];
      type Result = HasTypeCheck<
        TupleType,
        [{ a: string }, { b: number }],
        true
      >;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step(
      "Tuple where not all types extend the target (Match All)",
      () => {
        type TupleType = [{ a: string }, { c: boolean }];
        type Result = HasTypeCheck<TupleType, { a: string }, true>;
        type Expected = false;

        const check: Result = false;
        assertFalse(check);

        type AssertTest = AssertEquals<Result, Expected>; // Expect: true
        const assertTest: AssertTest = true;
        assert(assertTest);
      },
    );
  });

  await t.step("Native Types", async (t) => {
    await t.step("Promise type extends Promise<any> (Match Any)", () => {
      type NativeType = Promise<string>;
      type Result = HasTypeCheck<NativeType, Promise<any>, false>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Date type extends Date (Match All)", () => {
      type NativeType = Date;
      type Result = HasTypeCheck<NativeType, Date, true>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Tuple with native types (Match Any)", () => {
      type TupleType = [Date, Promise<string>];
      type Result = HasTypeCheck<TupleType, [Date, Promise<string>], false>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Complex native types with generics (Match All)", () => {
      type NativeType = Map<string, number>;
      type Result = HasTypeCheck<NativeType, Map<any, any>, true>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });
  });

  await t.step("Complex Custom Types", async (t) => {
    await t.step("Nested objects extending target (Match Any)", () => {
      type NestedType = { a: { b: string } } | { a: { c: number } };
      type Result = HasTypeCheck<NestedType, { a: { b: string } }, false>;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Deeply nested objects (Match All)", () => {
      type NestedType = { a: { b: string } } & { a: { c: number } };
      type Result = HasTypeCheck<
        NestedType,
        { a: { b: string; c: number } },
        true
      >;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("Record of complex objects (Match All)", () => {
      type ComplexRecord = Record<string, { a: string; b: number }>;
      type Result = HasTypeCheck<
        ComplexRecord,
        Record<string, { a: string }>,
        true
      >;
      type Expected = true;

      const check: Result = true;
      assert(check);

      type AssertTest = AssertEquals<Result, Expected>; // Expect: true
      const assertTest: AssertTest = true;
      assert(assertTest);
    });

    await t.step("From EaC", () => {
      type EaCModuleHandler = {
        APIPath: string;
        Order: number;
      };

      type EaCModuleHandlers = {
        $Force?: boolean;
      } & Record<string, EaCModuleHandler>;

      type EaCVertexDetails = {
        Description?: string;
        Name?: string;
      } & EaCMetadataBase;
      type EaCMetadataBase =
        | Record<string | number | symbol, unknown>
        | undefined;
      type EaCEnterpriseDetails = EaCVertexDetails;
      type EverythingAsCode = {
        Details?: EaCEnterpriseDetails;
        EnterpriseLookup?: string;
        Handlers?: EaCModuleHandlers;
        ParentEnterpriseLookup?: string;
      };

      type details = HasTypeCheck<
        NonNullable<EverythingAsCode["Details"]>,
        EaCVertexDetails,
        true
      >;

      type handlers = HasTypeCheck<
        NonNullable<EverythingAsCode["Handlers"]>,
        EaCVertexDetails,
        true
      >;

      const detailsCheck: details = true;
      assert(detailsCheck);

      // const handlersCheck: handlers = false;
      // assert(handlersCheck);

      type AssertDetailsTest = AssertEquals<details, true>; // Expect: true
      const assertDetailsTest: AssertDetailsTest = true;
      assert(assertDetailsTest);

      // type AssertHandlersTest = AssertEquals<handlers, false>; // Expect: false
      // const assertHandlersTest: AssertHandlersTest = false;
      // assert(assertHandlersTest);
    });
  });
});
