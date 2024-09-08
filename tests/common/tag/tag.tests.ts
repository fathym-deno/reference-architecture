import type {
  $TagDeepStrip,
  $TagValues,
} from "../../../src/common/tags/.exports.ts";
import { assert } from "../../test.deps.ts";

Deno.test("$Tag Tests", async (t) => {
  type testTag =
    // { Hello: string } &
    $TagValues<
      "Test",
      "Thing",
      "value" | "trim",
      { trim: "true"; value: "false" }
    >;

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
});
