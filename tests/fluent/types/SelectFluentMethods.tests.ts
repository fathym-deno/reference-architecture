// deno-lint-ignore-file no-explicit-any
import type { SelectFluentMethods } from "../../../src/fluent/types/SelectFluentMethods.ts";
import type { $FluentTag } from "../../../src/fluent/types/tags/$FluentTag.ts";

Deno.test("Testing SelectFluentMethods", async (t) => {
  await t.step("Complex from EaC", () => {
    type EaCModuleHandler = {
      APIPath: string;

      Order: number;
    };

    type EaCModuleHandlers = {
      $Force?: boolean;
    } & Record<string, EaCModuleHandler>;

    type Example = {
      EnterpriseLookup?: string;

      Handlers?:
        & EaCModuleHandlers
        & $FluentTag<
          "Methods",
          never,
          "handlers",
          {
            handlers: {
              Compile: () => unknown;
            };
          }
        >;

      ParentEnterpriseLookup?: string;
    };

    type ResultHandlers = SelectFluentMethods<Example, any>["_Handlers"];
    type Result = SelectFluentMethods<Example, any>;

    type x = ResultHandlers;

    const c: ResultHandlers = {};

    c.$Force(true);

    c("TestKey").APIPath("");

    // runTest<
    //   Result,
    //   {
    //     EnterpriseLookup: (
    //       input: string | undefined,
    //     ) => FluentMethodsPropertyReturnType<Example, "EnterpriseLookup", any>;

    //     _Handlers:
    //       & {
    //         $Force: (
    //           input: boolean | undefined,
    //         ) => FluentMethodsPropertyReturnType<
    //           { $Force?: boolean | undefined },
    //           "$Force",
    //           any
    //         >;
    //       }
    //       & ((
    //         key: string,
    //       ) => FluentMethodsRecordReturnType<
    //         Example,
    //         "Handlers",
    //         | "Record"
    //         | (EaCModuleHandler & { "@Methods"?: "Property" | undefined }),
    //         any
    //       >);

    //     ParentEnterpriseLookup: (
    //       input: string | undefined,
    //     ) => FluentMethodsPropertyReturnType<
    //       Example,
    //       "ParentEnterpriseLookup",
    //       any
    //     >;
    //   }
    // >(
    //   {
    //     _Handlers: (key) => {
    //       return undefined as unknown as FluentMethodsRecordReturnType<
    //         Example,
    //         "Handlers",
    //         | "Record"
    //         | (EaCModuleHandler & { "@Methods"?: "Property" | undefined }),
    //         any
    //       >;
    //     },
    //   },
    //   {
    //     details: { method: "string" },
    //     _items: { method: "string" },
    //   },
    // );
  });
});
