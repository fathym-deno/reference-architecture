import type { NormalizeNever } from "../../../src/common/types/NormalizeNever.ts";
import type { AssertEquals } from "../../../src/common/.exports.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("NormalizeNever Tests", async (t) => {
  await t.step("Simple Type", () => {
    type Result = NormalizeNever<string, false>;
    type Expected = string;

    const check: Result = "test";
    assert(check);

    type AssertTest = AssertEquals<Result, Expected>; // Expect: true
    const _assertTest: AssertTest = true;
    assert(_assertTest);
  });

  await t.step("Simple Never", () => {
    type Result = NormalizeNever<never, false>;
    type Expected = false;

    const check: Result = false;
    assertEquals(check, false);

    type AssertTest = AssertEquals<Result, Expected>; // Expect: true
    const _assertTest: AssertTest = true;
    assert(_assertTest);
  });

  await t.step("Union with Never", () => {
    type Result = NormalizeNever<string | never, false>;
    type Expected = string | false;

    const check: Result = "test";
    assert(check);

    type AssertTest = AssertEquals<Result, Expected>; // Expect: true
    const _assertTest: AssertTest = true;
    assert(_assertTest);
  });

  await t.step("Intersection with Never", () => {
    type Result = NormalizeNever<string & never, false>;
    type Expected = false;

    const check: Result = false;
    assertEquals(check, false);

    type AssertTest = AssertEquals<Result, Expected>; // Expect: true
    const _assertTest: AssertTest = true;
    assert(_assertTest);
  });
});
