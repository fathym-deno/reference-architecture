// deno-lint-ignore-file no-explicit-any
import { runTest } from "../../../src/common/types/testing/runTest.ts";
import type { FluentMethodsMap } from "../../../src/fluent/types/FluentMethodsMap.ts";
import type { FluentMethodsObject } from "../../../src/fluent/types/FluentMethodsObject.ts";
import type { FluentMethodsRecord } from "../../../src/fluent/types/FluentMethodsRecord.ts";

Deno.test("Testing FluentMethodsMap", async (t) => {
  // Test with a simple object structure
  await t.step("Simple Object", () => {
    type Example = {
      prop: {
        name: string;
        details: {
          info: string;
        };
      };
    };

    type Result = FluentMethodsMap<Example, "prop", any>;

    runTest<Result["Object"], FluentMethodsObject<Example, "prop", any>>(
      {} as any,
      {} as any,
    );
  });

  // Test with union types
  await t.step("Union Type", () => {
    type UnionExample =
      | {
        propA: {
          name: string;
        };
      }
      | {
        propB: {
          info: number;
        };
      };

    type Result = FluentMethodsMap<UnionExample, keyof UnionExample, any>;

    // runTest<
    //   Result["Object"] | Result["Record"],
    //   | FluentMethodsObject<UnionExample, "propA", any>
    //   | FluentMethodsRecord<UnionExample, "propB", any>
    // >({} as any, {} as any);
  });

  // Test with a Record type
  await t.step("Record Type", () => {
    type RecordExample = Record<string, { value: string }>;

    type Result = FluentMethodsMap<RecordExample, string, any>;

    runTest<Result["Record"], FluentMethodsRecord<RecordExample, string, any>>(
      {} as any,
      {} as any,
    );
  });

  // Test with more complex nested structures
  await t.step("Complex Nested Structure", () => {
    type ComplexExample = {
      level1: {
        level2: {
          key: string;
        };
      };
    };

    type Result = FluentMethodsMap<ComplexExample, "level1", any>;

    runTest<
      Result["Object"],
      FluentMethodsObject<ComplexExample, "level1", any>
    >({} as any, {} as any);
  });
});
