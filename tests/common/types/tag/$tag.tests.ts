import type {
    $TagExists,
    $TagExtract,
    $TagExtractValue,
    $TagExtractValues,
    $TagValues,
} from "../../../../src/common/types/tags/.exports.ts";
import { assert, assertEquals, assertFalse } from "../../../test.deps.ts";

Deno.test("$Tag Tests", async (t) => {
    type testTag = $TagValues<
        "Test",
        "Thing",
        "value" | "trim",
        { trim: "true"; value: "false" }
    >;

    await t.step("Tag Creation", () => {
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

    await t.step("Tag Exists", () => {
        type tagExists = {
            Type: $TagExists<testTag, "Test">;
            TypeTag: $TagExists<testTag, "Test", "Thing">;
            TypeTagValues: $TagExists<testTag, "Test", "Thing", "trim">;
            TypeTagValuesBoth: $TagExists<
                testTag,
                "Test",
                "Thing",
                "trim" | "value"
            >;
            TypeTagValuesPartial: $TagExists<
                testTag,
                "Test",
                "Thing",
                "trim" | "Bad"
            >;
            BadType: $TagExists<testTag, "Bad", "Thing", "trim">;
            BadTag: $TagExists<testTag, "Test", "Bad", "trim">;
            BadTypeTag: $TagExists<testTag, "Bad", "Bad", "trim">;
            BadTypeTagValues: $TagExists<testTag, "Test", "Thing", "Bad">;
            BadTypeTagValuesBoth: $TagExists<
                testTag,
                "Test",
                "Thing",
                "Bad" | "Bad"
            >;
        };

        const d: tagExists = {
            Type: true,
            TypeTag: true,
            TypeTagValues: true,
            TypeTagValuesBoth: true,
            TypeTagValuesPartial: true,
            BadType: false,
            BadTag: false,
            BadTypeTag: false,
            BadTypeTagValues: false,
            BadTypeTagValuesBoth: false,
        };

        assert(d);
        assert(d.Type);
        assert(d.TypeTag);
        assert(d.TypeTagValues);
        assert(d.TypeTagValuesBoth);
        assert(d.TypeTagValuesPartial);
        assertFalse(d.BadType);
        assertFalse(d.BadTag);
        assertFalse(d.BadTypeTag);
        assertFalse(d.BadTypeTagValues);
        assertFalse(d.BadTypeTagValuesBoth);
    });

    await t.step("Tag Extracts", () => {
        type tag = $TagExtract<testTag, "Test">;

        const tagged: tag = "Thing";

        assert(tagged);
        assertEquals(tagged, "Thing");

        type tagValue = $TagExtractValue<testTag, "Test", tag, "trim">;

        const value: tagValue = "true";

        assertEquals(value, "true");

        type tagValues = $TagExtractValues<
            testTag,
            "Test",
            tag,
            "trim" | "value"
        >;

        const values: tagValues = {
            Test: {
                trim: "true",
                value: "false",
            },
        };

        assert(values?.Test?.trim);
        assert(values?.Test?.value);
        assertEquals(values?.Test?.trim, "true");
        assertEquals(values?.Test?.value, "false");
    });
});
