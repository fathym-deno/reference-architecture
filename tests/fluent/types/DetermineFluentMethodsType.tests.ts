import { runTest } from "../../../src/common/testing/runTest.ts";
import type { DetermineFluentMethodsType } from "../../../src/fluent/types/DetermineFluentMethodsType.ts";
import type { $FluentTag } from "../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("DetermineFluentMethodsType", async (t) => {
  await t.step("Automatic Resolution", async (t) => {
    await t.step("Basic Tests", async (t) => {
      await t.step("With FluentTag", () => {
        type Example = {
          key: {
            "@Methods": "Record";
          };
        };

        runTest<DetermineFluentMethodsType<Example, "key">, "Record">(
          "Record",
          "Record",
        );
      });

      await t.step("Without FluentTag (Fallback to Default)", () => {
        type ExampleWithoutTag = {
          key: {
            property: string;
          };
        };

        runTest<DetermineFluentMethodsType<ExampleWithoutTag, "key">, "Object">(
          "Object",
          "Object",
        );
      });

      await t.step("Without FluentTag (Fallback to Default)", () => {
        type ExampleWithoutTag = {
          key: Record<string, string>;
        };

        runTest<DetermineFluentMethodsType<ExampleWithoutTag, "key">, "Record">(
          "Record",
          "Record",
        );
      });
    });

    await t.step("Union Type Tests", async (t) => {
      await t.step("Union with FluentTag and no tag", () => {
        type UnionExample = {
          key: {
            "@Methods": "Object";
          };
        } & {
          key: {
            property: string;
          };
        };

        runTest<DetermineFluentMethodsType<UnionExample, "key">, "Object">(
          "Object",
          "Object",
        );
      });
    });

    await t.step("Record Type Tests", async (t) => {
      await t.step("Record type with FluentTag", () => {
        type RecordExample = Record<
          string,
          {
            "@Methods": "Record";
          }
        >;

        runTest<DetermineFluentMethodsType<RecordExample, string>, "Record">(
          "Record",
          "Record",
        );
      });
    });

    await t.step("Complex Nested Types", async (t) => {
      await t.step("Nested structure with FluentTag", () => {
        type ComplexNested = {
          outer: {
            inner: {
              "@Methods": "Object";
            };
          };
        };

        runTest<
          DetermineFluentMethodsType<ComplexNested["outer"], "inner">,
          "Object"
        >("Object", "Object");
      });
    });

    await t.step("Fallback for Index Signatures", async (t) => {
      await t.step("Defaults to Record with index signatures", () => {
        type FallbackIndexSignature = {
          key: Record<string, unknown>;
        };

        runTest<
          DetermineFluentMethodsType<FallbackIndexSignature, "key">,
          "Record"
        >("Record", "Record");
      });
    });

    await t.step("Complex from EaC", () => {
      type EaCModuleHandler = {
        APIPath: string;

        Order: number;
      };
      type EaCModuleHandlers = {
        $Force?: boolean;
      } & Record<string, EaCModuleHandler & $FluentTag<"Methods", "Object">>;

      type IndexSignature = {
        Handlers?: EaCModuleHandlers;
      };

      runTest<DetermineFluentMethodsType<IndexSignature, "Handlers">, "Record">(
        "Record",
        "Record",
      );
    });
  });
});
