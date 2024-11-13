// deno-lint-ignore-file ban-types
import type { $Tag } from "../../../src/common/tags/$Tag.ts";
import { runTest } from "../../../src/common/testing/runTest.ts";

Deno.test("$Tag Type Tests", async (t) => {
  // Test with basic types
  await t.step("Basic Tag Test", () => {
    type Result = $Tag<"test", "tag">;
    runTest<Result, { "@test"?: "tag" }>(
      { "@test": "tag" },
      { "@test": "tag" },
    );
  });

  // Test where TTag is never (no tag should be added)
  await t.step("Omit Tag when TTag is never", () => {
    type Result = $Tag<"test", never>;
    runTest<Result, {}>(true, true);
  });

  // Test where TTag is undefined (no tag should be added)
  await t.step("Omit Tag when TTag is undefined", () => {
    type Result = $Tag<"test", undefined>;
    runTest<Result, {}>(true, true);
  });

  // Test with a union type
  await t.step("Union Type Tag", () => {
    type Result = $Tag<"union", 1>;
    runTest<Result, { "@union"?: 1 }>({ "@union": 1 }, { "@union": 1 });
  });

  // Test with null
  await t.step("Tag with null as TTag", () => {
    type Result = $Tag<"nullable", null>;
    runTest<Result, { "@nullable"?: null }>(
      { "@nullable": null },
      { "@nullable": null },
    );
  });

  // Test with boolean type
  await t.step("Tag with boolean as TTag", () => {
    type Result = $Tag<"boolean", true>;
    runTest<Result, { "@boolean"?: true }>(
      { "@boolean": true },
      { "@boolean": true },
    );
  });

  // Test with a complex object type
  await t.step("Tag with Complex Object", () => {
    type Result = $Tag<"info", { description: string; active: boolean }>;
    runTest<Result, { "@info"?: { description: string; active: boolean } }>(
      { "@info": { description: "Desc", active: true } },
      { "@info": { description: "Desc", active: true } },
    );
  });
});
