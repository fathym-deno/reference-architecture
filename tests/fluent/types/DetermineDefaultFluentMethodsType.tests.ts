import type { IsRecord } from "../../../src/common/types/IsRecord.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";
import type { ValueType } from "../../../src/common/types/ValueType.ts";
import type { DetermineDefaultFluentMethodsType } from "../../../src/fluent/types/DetermineDefaultFluentMethodsType.ts";
import type { $FluentTag } from "../../../src/fluent/types/tags/$FluentTag.ts";
import type { $FluentTagExtract } from "../../../src/fluent/types/tags/$FluentTagExtract.ts";

Deno.test("Testing DetermineDefaultFluentMethodsType", async (t) => {
  // Test for simple object type
  await t.step("Simple Object Evaluation", () => {
    type Example = {
      key: { name: string };
    };

    runTest<DetermineDefaultFluentMethodsType<Example, "key">, "Object">(
      "Object",
      "Object",
    );
  });

  // Test for Record type (string to number mapping)
  await t.step("Record with Index Signature", () => {
    type Example = {
      key: Record<string, number>;
    };
    runTest<DetermineDefaultFluentMethodsType<Example, "key">, "Record">(
      "Record",
      "Record",
    );
  });

  // Test for simple property (non-object)
  await t.step("Simple Property Evaluation", () => {
    type Example = {
      key: number;
    };
    runTest<DetermineDefaultFluentMethodsType<Example, "key">, "Property">(
      "Property",
      "Property",
    );
  });

  // Test for nested object with index signature
  await t.step("Nested Object with Index Signature", () => {
    type Example = {
      key: { [key: string]: { value: number } };
    };
    runTest<DetermineDefaultFluentMethodsType<Example, "key">, "Record">(
      "Record",
      "Record",
    );
  });

  // Test for union type with object and non-object
  await t.step("Union type with object and non-object", () => {
    type UnionExample = { name: string } & number;
    runTest<
      DetermineDefaultFluentMethodsType<UnionExample, "name">,
      "Property"
    >("Property", "Property");
  });

  // Test for complex Record type (Record of objects)
  await t.step("Complex Record Type", () => {
    type ComplexRecord = Record<string, { name: string; age: number }>;
    runTest<DetermineDefaultFluentMethodsType<ComplexRecord, string>, "Object">(
      "Object",
      "Object",
    );
  });

  // Test for optional property (object type)
  await t.step("Optional Property (Object)", () => {
    type Example = {
      key?: { name: string };
    };
    runTest<DetermineDefaultFluentMethodsType<Example, "key">, "Object">(
      "Object",
      "Object",
    );
  });

  // Test for index signature with more complex types
  await t.step("Index Signature with Complex Types", () => {
    type ComplexExample = {
      key: { [key: string]: { details: string; count: number } };
    };
    runTest<DetermineDefaultFluentMethodsType<ComplexExample, "key">, "Record">(
      "Record",
      "Record",
    );
  });

  await t.step("Record with complex value type", () => {
    type ComplexExample = {
      key: Record<string, { details: string; count: number }>;
    };
    runTest<DetermineDefaultFluentMethodsType<ComplexExample, "key">, "Record">(
      "Record",
      "Record",
    );
  });

  await t.step("Record with Record unknown", () => {
    type ComplexExample = {
      key: Record<string, unknown>;
    };
    type x = IsRecord<ComplexExample["key"]>;
    type xx = isFluentRecord<ComplexExample["key"]>;
    runTest<DetermineDefaultFluentMethodsType<ComplexExample, "key">, "Record">(
      "Record",
      "Record",
    );
  });

  type isFluentRecord<T> = $FluentTagExtract<T, "Methods"> extends ["Record"]
    ? true
    : $FluentTagExtract<T, "Methods"> extends [never]
      ? true extends IsRecord<T> ? true
      : false
    : false;

  await t.step("Record with Record value type with complex value type", () => {
    type ComplexExample = {
      key: Record<string, Record<string, { details: string; count: number }>>;
    };

    runTest<DetermineDefaultFluentMethodsType<ComplexExample, "key">, "Record">(
      "Record",
      "Record",
    );
  });

  await t.step(
    "Record with Record value type with complex value type - Not Record",
    () => {
      type ComplexExample = {
        key: Record<
          string,
          & Record<string, { details: string; count: number }>
          & $FluentTag<"Methods", "Object">
        >;
      };

      type xxx = isFluentRecord<ValueType<ComplexExample["key"]>>;
      type xx = ValueType<ComplexExample["key"]>;
      type x = $FluentTagExtract<xx, "Methods">;

      runTest<
        DetermineDefaultFluentMethodsType<ComplexExample, "key">,
        "Record"
      >("Record", "Record");
    },
  );
});
