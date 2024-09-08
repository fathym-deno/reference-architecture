import type { $TagExists } from "../../../src/common/tags/$TagExists.ts";
import type { $TagValues } from "../../../src/common/tags/$TagValues.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";
import { assert, assertFalse } from "../../test.deps.ts";

Deno.test("$TagExists Type Tests", async (t) => {
  // Test for the presence of a simple tag
  await t.step("Basic Tag Exists", () => {
    type Result = $TagExists<{ "@test": "tag" }, "test">;

    runTest<Result, true>(true, true); // This should pass
  });

  // Test for the absence of a simple tag
  await t.step("Basic Tag Does Not Exist", () => {
    type Result = $TagExists<{ "@other": "tag" }, "test">;

    runTest<Result, false>(false, false); // This should pass
  });

  // Test for the presence of a tag with a specific value
  await t.step("Tag with Specific Value Exists", () => {
    type Result = $TagExists<{ "@test": "value" }, "test", "value">;
    runTest<Result, true>(true, true); // This should pass
  });

  // Test for the absence of a tag with a different value
  await t.step("Tag with Different Value", () => {
    type Result = $TagExists<{ "@test": "other" }, "test", "value">;
    runTest<Result, false>(false, false); // This should pass
  });

  // Test for tag with metadata key
  await t.step("Tag with Metadata Key Exists", () => {
    type Result = $TagExists<{ "@test-data": "hello" }, "test", never, "data">;

    runTest<Result, true>(true, true); // This should pass
  });

  // Test for absence of metadata key in tag
  await t.step("Tag with Missing Metadata Key", () => {
    type Result = $TagExists<{ "@test": string }, "test", never, "data">;
    runTest<Result, false>(false, false); // This should pass
  });

  // Test with multiple metadata keys
  await t.step("Tag with Multiple Metadata Keys", () => {
    type Result = $TagExists<
      { "@test-data": string; "@test-info": number },
      "test",
      never,
      "data" | "info"
    >;
    runTest<Result, true>(true, true); // This should pass
  });

  // Test for tag with missing metadata keys
  await t.step("Tag with Missing Multiple Metadata Keys", () => {
    type Result = $TagExists<{ "@test-data": string }, "test", never, "info">;
    runTest<Result, false>(false, false); // This should pass
  });

  type testTag =
    // { Hello: string } &
    $TagValues<
      "Test",
      "Thing",
      "value" | "trim",
      { trim: "true"; value: "false" }
    >;

  await t.step("Tag Exists", () => {
    type x = $TagExists<testTag, "Test">;

    type tagExists = {
      Type: $TagExists<testTag, "Test">;
      TypeTag: $TagExists<testTag, "Test", "Thing">;
      TypeTagValues: $TagExists<testTag, "Test", "Thing", "trim">;
      TypeTagValuesBoth: $TagExists<testTag, "Test", "Thing", "trim" | "value">;
      BadType: $TagExists<testTag, "Bad", "Thing", "trim">;
      BadTag: $TagExists<testTag, "Test", "Bad", "trim">;
      BadTypeTag: $TagExists<testTag, "Bad", "Bad", "trim">;
      BadTypeTagValues: $TagExists<testTag, "Test", "Thing", "Bad">;
      BadTypeTagValuesBoth: $TagExists<testTag, "Test", "Thing", "Bad" | "Bad">;
      BadTypeTagValuesPartial: $TagExists<
        testTag,
        "Test",
        "Thing",
        "trim" | "Bad"
      >;
    };

    const d: tagExists = {
      Type: true,
      TypeTag: true,
      TypeTagValues: true,
      TypeTagValuesBoth: true,
      BadType: false,
      BadTag: false,
      BadTypeTag: false,
      BadTypeTagValues: false,
      BadTypeTagValuesBoth: false,
      BadTypeTagValuesPartial: false,
    };

    assert(d);
    assert(d.Type);
    assert(d.TypeTag);
    assert(d.TypeTagValues);
    assert(d.TypeTagValuesBoth);
    assertFalse(d.BadType);
    assertFalse(d.BadTag);
    assertFalse(d.BadTypeTag);
    assertFalse(d.BadTypeTagValues);
    assertFalse(d.BadTypeTagValuesBoth);
    assertFalse(d.BadTypeTagValuesPartial);
  });

  await t.step("Tag Exists - Values Only", () => {
    type tagged = $TagValues<"Test", never, "trim", { trim: true }>;

    type tagExists = {
      Type: $TagExists<testTag, "Test">;
      TypeTagValues: $TagExists<testTag, "Test", never, "trim">;
      TypeTagValuesBoth: $TagExists<testTag, "Test", never, "trim" | "value">;
      BadType: $TagExists<testTag, "Bad", never, "trim">;
      BadTag: $TagExists<testTag, "Test", "Bad", "trim">;
      BadTypeTag: $TagExists<testTag, "Bad", "Bad", "trim">;
      BadTypeTagExclude: $TagExists<testTag, "Test", never>;
      BadTypeTagValues: $TagExists<testTag, "Test", never, "Bad">;
      BadTypeTagValuesBoth: $TagExists<testTag, "Test", never, "Bad" | "Bad">;
      BadTypeTagValuesPartial: $TagExists<
        testTag,
        "Test",
        never,
        "trim" | "Bad"
      >;
    };

    const d: tagExists = {
      Type: true,
      TypeTagValues: true,
      TypeTagValuesBoth: true,
      BadType: false,
      BadTag: false,
      BadTypeTag: false,
      BadTypeTagExclude: false,
      BadTypeTagValues: false,
      BadTypeTagValuesBoth: false,
      BadTypeTagValuesPartial: false,
    };

    assert(d);
    assert(d.Type);
    assert(d.TypeTagValues);
    assert(d.TypeTagValuesBoth);
    assertFalse(d.BadType);
    assertFalse(d.BadTag);
    assertFalse(d.BadTypeTag);
    assertFalse(d.BadTypeTagExclude);
    assertFalse(d.BadTypeTagValues);
    assertFalse(d.BadTypeTagValuesBoth);
    assertFalse(d.BadTypeTagValuesPartial);
  });

  await t.step("Tag Record Exists", () => {
    type recordTest =
      & Record<
        string,
        {
          BringIt: boolean;
        }
      >
      & testTag;

    type tagExists = {
      Type: $TagExists<recordTest, "Test">;
      TypeTag: $TagExists<recordTest, "Test", "Thing">;
      TypeTagValues: $TagExists<recordTest, "Test", "Thing", "trim">;
      TypeTagValuesBoth: $TagExists<
        recordTest,
        "Test",
        "Thing",
        "trim" | "value"
      >;
      BadType: $TagExists<recordTest, "Bad", "Thing", "trim">;
      BadTag: $TagExists<recordTest, "Test", "Bad", "trim">;
      BadTypeTag: $TagExists<recordTest, "Bad", "Bad", "trim">;
      BadTypeTagValues: $TagExists<recordTest, "Test", "Thing", "Bad">;
      BadTypeTagValuesBoth: $TagExists<
        recordTest,
        "Test",
        "Thing",
        "Bad" | "Bad"
      >;
      BadTypeTagValuesPartial: $TagExists<
        recordTest,
        "Test",
        "Thing",
        "trim" | "Bad"
      >;
    };

    const d: tagExists = {
      Type: true,
      TypeTag: true,
      TypeTagValues: true,
      TypeTagValuesBoth: true,
      BadType: false,
      BadTag: false,
      BadTypeTag: false,
      BadTypeTagValues: false,
      BadTypeTagValuesBoth: false,
      BadTypeTagValuesPartial: false,
    };

    assert(d);
    assert(d.Type);
    assert(d.TypeTag);
    assert(d.TypeTagValues);
    assert(d.TypeTagValuesBoth);
    assertFalse(d.BadType);
    assertFalse(d.BadTag);
    assertFalse(d.BadTypeTag);
    assertFalse(d.BadTypeTagValues);
    assertFalse(d.BadTypeTagValuesBoth);
    assertFalse(d.BadTypeTagValuesPartial);
  });
});
