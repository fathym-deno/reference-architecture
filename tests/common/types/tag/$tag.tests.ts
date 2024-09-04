import type { $Tag } from "../../../../src/common/types/tags/.exports.ts";
import { assert, assertEquals } from "../../../test.deps.ts";

Deno.test("$Tag Tests", async (t) => {
    await t.step("Tag Creation", () => {
        type testTag = $Tag<
            "Test",
            "Thing",
            "value" | "trim",
            { trim: "true"; value: "false" }
        >;

        const check: testTag = {
            "@Test": "Thing",
            "@Test-trim": "true",
            "@Test-value": "false",
        };

        assert(check);
        assertEquals(check["@Test-trim"], "true");
        assertEquals(check["@Test-value"], "false");

        type testValue = NonNullable<testTag["@Test-value"]> extends "false"
            ? true
            : false;

        const checkValue: testValue = true;

        assert(checkValue);
    });
});
