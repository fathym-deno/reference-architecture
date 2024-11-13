import type { IsMatched } from "../../../src/common/types/IsMatched.ts";
import type { NormalizeNever } from "../../../src/common/types/NormalizeNever.ts";
import { runTest } from "../../../src/common/testing/runTest.ts";

Deno.test("IsMatched Tests", async (t) => {
  await t.step("Match All - Ensure all are true", async (t) => {
    await t.step("All true", () => {
      runTest<IsMatched<true | true, true>, true>(true, true);
    });

    await t.step("Mixed true and false", () => {
      runTest<IsMatched<true | false, true>, false>(false, false);
    });

    await t.step("All false", () => {
      runTest<IsMatched<false | false, true>, false>(false, false);
    });

    await t.step("Single true", () => {
      runTest<IsMatched<true, true>, true>(true, true);
    });

    await t.step("Single false", () => {
      runTest<IsMatched<false, true>, false>(false, false);
    });

    await t.step("Contains never (treated as false)", () => {
      runTest<
        IsMatched<true | true | NormalizeNever<never, false>, true>,
        false
      >(false, false);
    });
  });

  await t.step("Match Any - Ensure at least one is true", async (t) => {
    await t.step("All true", () => {
      runTest<IsMatched<true | true, false>, true>(true, true);
    });

    await t.step("Mixed true and false", () => {
      runTest<IsMatched<true | false, false>, true>(true, true);
    });

    await t.step("All false", () => {
      runTest<IsMatched<false | false, false>, false>(false, false);
    });

    await t.step("Single true", () => {
      runTest<IsMatched<true, false>, true>(true, true);
    });

    await t.step("Single false", () => {
      runTest<IsMatched<false, false>, false>(false, false);
    });

    await t.step("Contains never (treated as false)", () => {
      runTest<IsMatched<true | false | never, false>, true>(true, true);
    });

    await t.step("Only never (treated as false)", () => {
      runTest<IsMatched<never, false>, false>(false, false);
    });
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("Empty union (Match Any)", () => {
      runTest<IsMatched<never, false>, false>(false, false);
    });

    await t.step("Empty union (Match All)", () => {
      runTest<IsMatched<never, true>, false>(false, false);
    });

    await t.step("Boolean directly (Match All)", () => {
      runTest<IsMatched<true | false, true>, false>(false, false);
    });

    await t.step("Boolean directly (Match Any)", () => {
      runTest<IsMatched<true | false, false>, true>(true, true);
    });

    await t.step("Intersection with true (Match All)", () => {
      runTest<IsMatched<true & true, true>, true>(true, true);
    });

    await t.step("Intersection with false (Match Any)", () => {
      runTest<IsMatched<false & true, false>, false>(false, false);
    });
  });
});
