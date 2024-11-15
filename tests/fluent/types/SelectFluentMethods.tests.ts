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
