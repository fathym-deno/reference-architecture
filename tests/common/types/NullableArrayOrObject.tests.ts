import type { NullableArrayOrObject } from "../../../src/common/types/NullableArrayOrObject.ts";
import { runTest } from "../../../src/common/testing/runTest.ts";

Deno.test("NullableArrayOrObject Tests", async (t) => {
  // Test for a simple object with primitive properties and arrays
  await t.step("Simple Type Test", () => {
    type SimpleType = {
      name: string;
      age: number;
      tags: string[];
    };

    type NullableSimpleType = NullableArrayOrObject<SimpleType>;

    // Actual test value that conforms to NullableSimpleType
    const nullableSimpleValue: NullableSimpleType = {
      name: "John",
      age: 30,
      tags: null,
    };

    runTest<
      NullableSimpleType,
      { name: string; age: number; tags: string[] | null }
    >(nullableSimpleValue, nullableSimpleValue);
  });

  // Test for a complex object with nested properties and arrays
  await t.step("Complex Type Test", () => {
    type ComplexType = {
      id: number;
      info: {
        name: string;
        address: {
          street: string;
          city: string;
        };
        hobbies: {
          name: string;
          years: number;
        }[];
      };
      tags: string[];
    };

    type NullableComplexType = NullableArrayOrObject<ComplexType>;

    // Actual test value that conforms to NullableComplexType
    const nullableComplexValue: NullableComplexType = {
      id: 1,
      info: {
        name: "Jane",
        address: null, // Address becomes nullable
        hobbies: [
          { name: "Basketball", years: 5 },
          { name: "Skiing", years: 10 },
        ],
      },
      tags: null, // Tags become nullable
    };

    runTest<
      NullableComplexType,
      {
        id: number;
        info: {
          name: string;
          address: { street: string; city: string } | null;
          hobbies: { name: string; years: number }[] | null;
        } | null;
        tags: string[] | null;
      }
    >(nullableComplexValue, nullableComplexValue);
  });

  // Test for handling union types with arrays
  await t.step("Union Type Test", () => {
    type UnionType = { data: string[] | number[] };

    type NullableUnionType = NullableArrayOrObject<UnionType>;

    // Actual test value that conforms to NullableUnionType
    const nullableUnionValue: NullableUnionType = {
      data: null, // Data becomes nullable
    };

    runTest<NullableUnionType, { data: string[] | number[] | null }>(
      nullableUnionValue,
      nullableUnionValue,
    );
  });

  // Test for handling nested Record types
  await t.step("Nested Record Type Test", () => {
    type NestedRecordType = Record<
      string,
      { key: number; details: { info: string[] } }
    >;

    type NullableNestedRecord = NullableArrayOrObject<NestedRecordType>;

    // Actual test value that conforms to NullableNestedRecord
    const nullableNestedRecordValue: NullableNestedRecord = {
      item1: {
        key: 1,
        details: {
          info: null, // Info becomes nullable
        },
      },
      item2: {
        key: 2,
        details: null, // Details become nullable
      },
    };

    runTest<
      NullableNestedRecord,
      Record<string, { key: number; details: { info: string[] | null } | null }>
    >(nullableNestedRecordValue, nullableNestedRecordValue);
  });
});
