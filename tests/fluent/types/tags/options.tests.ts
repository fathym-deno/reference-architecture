import type { $FluentTagDataKeyOptions } from "../../../../src/fluent/types/tags/$FluentTagDataKeyOptions.ts";
import type { $FluentTagDataValueTypesOptions } from "../../../../src/fluent/types/tags/$FluentTagDataValueOptions.ts";
import type { $FluentTagOptions } from "../../../../src/fluent/types/tags/$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "../../../../src/fluent/types/tags/$FluentTagTypeOptions.ts";

Deno.test("Testing Fluent Tag Types", async (t) => {
  // Testing $FluentTagTypeOptions
  await t.step("$FluentTagTypeOptions basic test", () => {
    type Result = $FluentTagTypeOptions;
    const expected: Result = "Methods";
    console.assert(expected === "Methods", "Type options mismatch");
  });

  // Testing $FluentTagOptions
  await t.step("$FluentTagOptions test for Methods", () => {
    type MethodsTagOptions = $FluentTagOptions<"Methods">;
    const result: MethodsTagOptions = "Record";
    console.assert(result === "Record", "Methods tag options mismatch");
  });

  // Testing $FluentTagDataKeyOptions
  await t.step("$FluentTagDataKeyOptions test for Methods", () => {
    type MethodsDataKeys = $FluentTagDataKeyOptions<"Methods">;
    const result: MethodsDataKeys = "generic";
    console.assert(result === "generic", "Data key options mismatch");
  });

  // Testing $FluentTagDataValueTypesOptions
  await t.step(
    "$FluentTagDataValueTypesOptions test for Methods and generic",
    () => {
      type DataValueOptions = $FluentTagDataValueTypesOptions<
        "Methods",
        "generic"
      >;
      const result: DataValueOptions = true;
      console.assert(result === true, "Data value options mismatch");
    },
  );

  await t.step(
    "$FluentTagDataValueTypesOptions test for Methods and handlers",
    () => {
      type HandlersValue = $FluentTagDataValueTypesOptions<
        "Methods",
        "handlers"
      >;
      const result: HandlersValue = { lookup: () => {} };
      console.assert(
        typeof result.lookup === "function",
        "Handlers type mismatch",
      );
    },
  );
});
