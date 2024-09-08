import type { NormalizeNever } from "../../../src/common/.exports.ts";
import type { MatchSwitch } from "../../../src/common/types/MatchSwitch.ts";
import { runTest } from "../../../src/common/types/testing/runTest.ts";

Deno.test("MatchSwitch Tests", async (t) => {
  await t.step("Match All - All true", () => {
    runTest<MatchSwitch<true | true, "Matched", "NotMatched", true>, "Matched">(
      "Matched",
      "Matched",
    );
  });

  await t.step("Match All - Mixed true and false", () => {
    runTest<
      MatchSwitch<true | false, "Matched", "NotMatched", true>,
      "NotMatched"
    >("NotMatched", "NotMatched");
  });

  await t.step("Match Any - Mixed true and false", () => {
    runTest<
      MatchSwitch<true | false, "Matched", "NotMatched", false>,
      "Matched"
    >("Matched", "Matched");
  });

  await t.step("Match Any - All false", () => {
    runTest<
      MatchSwitch<false | false, "Matched", "NotMatched", false>,
      "NotMatched"
    >("NotMatched", "NotMatched");
  });

  await t.step("Match All - Contains never", () => {
    runTest<
      MatchSwitch<
        true | true | NormalizeNever<never>,
        "Matched",
        "NotMatched",
        true
      >,
      "NotMatched"
    >("NotMatched", "NotMatched");
  });

  await t.step("Match Any - Contains never", () => {
    runTest<
      MatchSwitch<true | never, "Matched", "NotMatched", false>,
      "Matched"
    >("Matched", "Matched");
  });

  await t.step("Works with objects - Match Any", () => {
    runTest<
      MatchSwitch<
        { a: string } | { b: number },
        "Matched",
        "NotMatched",
        false
      >,
      "NotMatched"
    >("NotMatched", "NotMatched");
  });

  await t.step("Works with objects - Match All", () => {
    runTest<
      MatchSwitch<{ a: string } | { b: number }, "Matched", "NotMatched", true>,
      "NotMatched"
    >("NotMatched", "NotMatched");
  });
});
