import type {
  $TagStrip,
  HasTypeCheck,
  NoPropertiesUndefined,
} from "../../../src/common/types/.exports.ts";
import type {
  $TagDeepStrip,
  $TagExists,
  $TagExtract,
  $TagExtractValue,
  $TagExtractValues,
  $TagValues,
} from "../../../src/common/tags/.exports.ts";
import { assert, assertEquals, assertFalse } from "../../test.deps.ts";

Deno.test("$Tag Tests", async (t) => {
  type testTag =
    // { Hello: string } &
    $TagValues<
      "Test",
      "Thing",
      "value" | "trim",
      { trim: "true"; value: "false" }
    >;

  const check: testTag = {
    // Hello: 'World',
    "@Test": "Thing",
    "@Test-trim": "true",
    "@Test-value": "false",
  };

  await t.step("Tag Creation", () => {
    assert(check);
    assertEquals(check["@Test-trim"], "true");
    assertEquals(check["@Test-value"], "false");

    type testValue = NonNullable<testTag["@Test-value"]> extends "false" ? true
      : false;

    const checkValue: testValue = true;

    assert(checkValue);
  });

  await t.step("Tag Extracts", () => {
    type tag = $TagExtract<testTag, "Test">;

    const tagged: tag = "Thing";

    assert(tagged);
    assertEquals(tagged, "Thing");

    type tagValue = $TagExtractValue<testTag, "Test", "trim">;

    type tagValueCheck = tagValue extends "true" ? true : false;

    const value: tagValueCheck = true;

    assertEquals(value, true);

    type tagValues = $TagExtractValues<testTag, "Test", tag, "trim" | "value">;

    type tagValueChecks = {
      [KValue in keyof tagValues]: {
        [K in keyof tagValues[KValue]]: K extends "trim"
          ? tagValues[KValue]["trim"] extends "true" ? true
          : false
          : K extends "value"
            ? tagValues[KValue]["value"] extends "false" ? true
            : false
          : false;
      };
    };

    const values: tagValueChecks = {
      Test: {
        trim: true,
        value: true,
      },
    };

    assert(values?.Test?.trim);
    assert(values?.Test?.value);
    assert(values?.Test?.trim);
    assert(values?.Test?.value);
  });

  await t.step("Tag Record Extracts", () => {
    type recordTest =
      & Record<
        string,
        {
          BringIt: boolean;
        }
      >
      & testTag;

    type tag = $TagExtract<recordTest, "Test">;

    const tagged: tag = "Thing";

    assert(tagged);
    assertEquals(tagged, "Thing");

    type tagValue = $TagExtractValue<recordTest, "Test", "trim">;

    const value: tagValue = "true";

    assertEquals(value, "true");

    type tagValues = $TagExtractValues<
      recordTest,
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

  await t.step("Tag Stripped", () => {
    type tagStripped1 = $TagStrip<testTag, "Test">;

    const stripped1: tagStripped1 = {
      // Hello: 'World',
    };

    assert(stripped1);

    type tagStripped2 = $TagStrip<testTag, "Test", "Thing", "trim">;

    const stripped2: tagStripped2 = {
      // Hello: 'World',
      "@Test": "Thing",
      "@Test-value": "false",
    };

    assert(stripped2);
    assertEquals(stripped2["@Test"], "Thing");
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped2["@Test-trim"]);
    assertEquals(stripped2["@Test-value"], "false");

    type tagStripped3 = $TagStrip<testTag, "Test", "Thing", "trim" | "value">;

    const stripped3: tagStripped3 = {
      // Hello: 'World',
      "@Test": "Thing",
    };

    assert(stripped3);
    assertEquals(stripped3["@Test"], "Thing");
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped3["@Test-trim"]);
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped3["@Test-value"]);

    type tagStripped4 = $TagStrip<testTag, "Test", "Thing", never, true>;

    const stripped4: tagStripped4 = {
      // Hello: 'World',
      "@Test-trim": "true",
      "@Test-value": "false",
    };

    assert(stripped4);
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped4["@Test"]);
    assertEquals(stripped4["@Test-trim"], "true");
    assertEquals(stripped4["@Test-value"], "false");
  });

  await t.step("Tag Deep Stripped", () => {
    type test = {
      Bucket:
        & Record<
          string,
          {
            BringIt: boolean;
          }
        >
        & testTag;
    };

    type tagStripped1 = $TagDeepStrip<test, "Test">;

    const stripped1: tagStripped1 = {
      // Hello: 'World',
      Bucket: { Test: { BringIt: true } },
    };

    assert(stripped1);

    type tagStripped2 = $TagDeepStrip<test, "Test", "Thing">;

    const stripped2: tagStripped2 = {
      // Hello: 'World',
      Bucket: { "": { BringIt: true } },
    };

    assert(stripped2);
    assert(stripped2.Bucket[""].BringIt);
  });

  await t.step("Tag Value Only Extracts", () => {
    type tagged = $TagValues<"Test", never, "test", { test: true }>;

    type tagExists = $TagExists<tagged, "Test", never>;
    type tagExists2 = $TagExists<tagged, "Test", never, "test">;
    type xx = NoPropertiesUndefined<tagged>;
    type x = HasTypeCheck<
      tagged,
      {
        [K in `@Test-test`]: unknown;
      }
    >;

    type tagValue = $TagExtractValue<tagged, "Test", "test">;

    type tagValueCheck = "true" extends tagValue ? true : false;

    // const value: tagValueCheck = true;

    // assertEquals(value, true);

    // type tagValues = $TagExtractValues<testTag, 'Test', tag, 'trim' | 'value'>;

    // type tagValueChecks = {
    //   [KValue in keyof tagValues]: {
    //     [K in keyof tagValues[KValue]]: K extends 'trim'
    //       ? tagValues[KValue]['trim'] extends 'true'
    //         ? true
    //         : false
    //       : K extends 'value'
    //       ? tagValues[KValue]['value'] extends 'false'
    //         ? true
    //         : false
    //       : false;
    //   };
    // };

    // const values: tagValueChecks = {
    //   Test: {
    //     trim: true,
    //     value: true,
    //   },
    // };

    // assert(values?.Test?.trim);
    // assert(values?.Test?.value);
    // assert(values?.Test?.trim);
    // assert(values?.Test?.value);
  });
});
