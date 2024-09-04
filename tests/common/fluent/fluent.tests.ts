import type { FluentTagOptions } from "../../../src/fluent/types/$FluentTagOptions.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("Fluent Tests", async (t) => {
    await t.step("Type Tests", () => {
        Deno.test("Fluent Tests", async (t) => {
            await t.step("Fluent Tag Options", () => {
                type t = FluentTagOptions<"Methods">;

                const c: t = "Record";

                assert(c);
                assertEquals(c, "Record");
            });

            await t.step("Fluent Tag Dat Key Options", () => {
                type t = FluentTagDatKeyOptions<"Methods">;

                const c: t = "Record";

                assert(c);
                assertEquals(c, "Record");
            });
        });
    });
});
