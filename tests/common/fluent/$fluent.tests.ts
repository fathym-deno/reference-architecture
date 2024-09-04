import type {
    $FluentTag,
    $FluentTagDataKeyOptions,
    $FluentTagExists,
    $FluentTagExtract,
    $FluentTagExtractValue,
    $FluentTagExtractValues,
    $FluentTagOptions,
    $FluentTagTypeOptions,
} from "../../../src/fluent/.exports.ts";
import type {} from "../../../src/fluent/types/$FluentTagOptions.ts";
import { assert, assertEquals, assertFalse } from "../../test.deps.ts";

Deno.test("Fluent Tests", async (t) => {
    await t.step("Type Tests", () => {
        Deno.test("Fluent Tests", async (t) => {
            await t.step("Fluent Tag Type Options", () => {
                type t = $FluentTagTypeOptions;

                const c: t = "Methods";

                assert(c);
                assertEquals(c, "Methods");
            });

            await t.step("Fluent Tag Options", () => {
                type t = $FluentTagOptions<"Methods">;

                const c: t = "Record";

                assert(c);
                assertEquals(c, "Record");
            });

            await t.step("Fluent Tag Data Key Options", () => {
                type t = $FluentTagDataKeyOptions<"Methods">;

                const c: t = "...";

                assert(c);
                assertEquals(c, "...");
            });

            type tagFluent = $FluentTag<
                "Methods",
                "Property",
                "..." | "......",
                { "...": "true"; "......": "false" }
            >;

            await t.step("Tag Exists", () => {
                type tagExists = {
                    Type: $FluentTagExists<tagFluent, "Methods">;
                    TypeTag: $FluentTagExists<tagFluent, "Methods", "Property">;
                    TypeTagValues: $FluentTagExists<
                        tagFluent,
                        "Methods",
                        "Property",
                        "..."
                    >;
                    TypeTagValuesBoth: $FluentTagExists<
                        tagFluent,
                        "Methods",
                        "Property",
                        "..." | "......"
                    >;
                    TypeTagValuesPartial: $FluentTagExists<
                        tagFluent,
                        "Methods",
                        "Property",
                        // @ts-ignore Allow setting a bad value to support test
                        "..." | "Bad"
                    >;
                    BadType: $FluentTagExists<
                        tagFluent,
                        // @ts-ignore Allow setting a bad value to support test
                        "Bad",
                        "Property",
                        "..."
                    >;
                    BadTag: $FluentTagExists<
                        tagFluent,
                        "Methods",
                        // @ts-ignore Allow setting a bad value to support test
                        "Bad",
                        "..."
                    >;
                    BadTypeTag: $FluentTagExists<
                        tagFluent,
                        // @ts-ignore Allow setting a bad value to support test
                        "Bad",
                        "Bad",
                        "trim"
                    >;
                    BadTypeTagValues: $FluentTagExists<
                        tagFluent,
                        "Methods",
                        "Property",
                        // @ts-ignore Allow setting a bad value to support test
                        "Bad"
                    >;
                    BadTypeTagValuesBoth: $FluentTagExists<
                        tagFluent,
                        "Methods",
                        "Property",
                        // @ts-ignore Allow setting a bad value to support test
                        "Bad" | "Bad"
                    >;
                    WrongTag: $FluentTagExists<tagFluent, "Methods", "Object">;
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
                    WrongTag: false,
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
                assertFalse(d.WrongTag);
            });

            await t.step("Tag Extracts", () => {
                type tagExtract = $FluentTagExtract<tagFluent, "Methods">;

                const tagged: tagExtract = "Property";

                assert(tagged);
                assertEquals(tagged, "Thing");

                type tagValue = $FluentTagExtractValue<
                    tagFluent,
                    "Methods",
                    tagExtract,
                    "..."
                >;

                const value: tagValue = "true";

                assertEquals(value, "true");

                type tagValues = $FluentTagExtractValues<
                    tagFluent,
                    "Methods",
                    tagExtract,
                    "..." | "......"
                >;

                const values: tagValues = {
                    Methods: {
                        "...": "true",
                        "......": "false",
                    },
                };

                assert(values?.Methods?.["..."]);
                assert(values?.Methods?.["......"]);
                assertEquals(values?.Methods?.["..."], "true");
                assertEquals(values?.Methods?.["......"], "false");
            });
        });
    });
});
