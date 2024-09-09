import { runTest } from "../../../src/common/types/testing/runTest.ts";
import type { ValueType } from "../../../src/common/types/ValueType.ts";

// Simple Record Type
Deno.test("ValueType Tests - Simple Record", async (t) => {
  await t.step("Simple Record", () => {
    type SimpleRecord = Record<string, number>;
    runTest<ValueType<SimpleRecord>, number>(1, 1);
  });

  await t.step("Mixed Record (Union)", () => {
    type MixedRecord = Record<string, number> | Record<string, string>;

    runTest<ValueType<MixedRecord>, number | string>(1, 1);

    runTest<ValueType<MixedRecord>, number | string>("1", "1");
  });

  await t.step("Non-Record Type", () => {
    type NonRecord = { a: string; b: number };
    runTest<ValueType<NonRecord>, number | string>(1, 1);

    runTest<ValueType<NonRecord>, number | string>("1", "1");
  });

  await t.step("Complex Record with Nested Values", () => {
    type NestedRecord = Record<string, { key: number; value: string }>;

    runTest<ValueType<NestedRecord>, { key: number; value: string }>(
      { key: 1, value: "1" },
      { key: 1, value: "1" },
    );
  });

  await t.step("Complex Record with Nested Values", () => {
    type NestedRecord = Record<string, { key: number; value: string }>;

    runTest<ValueType<NestedRecord>, { key: number; value: string }>(
      { key: 1, value: "1" },
      { key: 1, value: "1" },
    );
  });

  await t.step("Complex Record with Nested From EaC", () => {
    type EaCModuleHandler = {
      APIPath: string;
      Order: number;
    };

    type EaCModuleHandlers = {
      $Force?: boolean;
    } & Record<string, EaCModuleHandler>;

    type EverythingAsCode = {
      EnterpriseLookup?: string;
      Handlers?: EaCModuleHandlers;
      ParentEnterpriseLookup?: string;
    }; // & EaCDetails<EaCEnterpriseDetails>;

    type u = NonNullable<EverythingAsCode["Handlers"]>;
    type U = ValueType<u>;

    runTest<U, { Order: number; APIPath: string }>(
      { Order: 1, APIPath: "1" },
      { Order: 1, APIPath: "1" },
    );
  });
});
