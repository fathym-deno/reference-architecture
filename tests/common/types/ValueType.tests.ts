import type { ValueType } from "../../../src/fluent/.deps.ts";

Deno.test("$Tag Tests", async (t) => {
  await t.step("Record", () => {
    type record = Record<string, { BringIt: boolean }>;

    type valueType = ValueType<record>;

    const _value: valueType = {
      BringIt: true,
    };
  });
});
