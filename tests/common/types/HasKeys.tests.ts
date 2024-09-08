// deno-lint-ignore-file ban-types

import type { HasKeys } from "../../../src/common/types/HasKeys.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("HasKeys Tests", async (t) => {
  await t.step("Simple Records", async (t) => {
    await t.step("Record with matching prefix", () => {
      runTest<HasKeys<Record<"prefixKey", string>, "prefix">, true>(true, true);
    });
    await t.step("Record without matching prefix", () => {
      runTest<HasKeys<Record<"key", string>, "prefix">, false>(false, false);
    });
  });

  await t.step("Complex Objects", async (t) => {
    await t.step("Nested object with matching prefix", () => {
      runTest<HasKeys<{ prefixKey: { subKey: string } }, "prefix">, true>(
        true,
        true,
      );
    });
    await t.step("Nested object without matching prefix", () => {
      runTest<HasKeys<{ key: { subKey: string } }, "prefix">, false>(
        false,
        false,
      );
    });
  });

  await t.step("Records with Index Signatures", async (t) => {
    await t.step("Record<string, string> with matching prefix", () => {
      runTest<HasKeys<Record<string, string>, "prefix">, false>(false, false);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("Empty object", () => {
      runTest<HasKeys<{}, "">, false>(false, false);
    });
    await t.step("Empty object with Prefix", () => {
      runTest<HasKeys<{}, "prefix">, false>(false, false);
    });
    await t.step("Empty prefix", () => {
      runTest<HasKeys<Record<"key", string>, "">, true>(true, true);
    });
    await t.step("Non-object type", () => {
      runTest<HasKeys<string, "prefix">, false>(false, false);
    });
  });
});
