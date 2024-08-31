import { UpdateInline } from "../../../src/common/cli/UpdateInline.ts";
import { assert, assertEquals } from "../../test.deps.ts";

Deno.test("Update Inline Tests", async (t) => {
  // await t.step('Quick Texts', () => {
  //   console.log(
  //     `${Colors.bgBlue(
  //       Colors.red(
  //         `Hello, ${Colors.bgYellow(
  //           Colors.black('Good day!')
  //         )} Its so nice to meet you`
  //       )
  //     )}... This seems fine`
  //   );

  //   console.log('Whats up?');
  // });

  await t.step("Only Text", async () => {
    const inliner = new UpdateInline();

    await inliner.Configure("Hello");

    assertEquals(inliner.LastInlined, "Hello");

    await inliner.Configure("Hello2");

    assertEquals(inliner.LastInlined, "Hello2");
  });

  await t.step("Blue background", async () => {
    const inliner = new UpdateInline();

    await inliner.Configure({
      Styles: ["blue"],
      Text: "Hello",
    });

    assert(inliner);
    assertEquals(inliner.LastInlined, "\x1b[34mHello\x1b[39m");
  });

  await t.step("MixedStyles", async () => {
    const inliner = new UpdateInline();

    await inliner.Configure({
      Styles: ["bgBrightBlue"],
      Text: {
        Text: "Hello",
        Styles: ["italic"],
      },
      PrefixText: {
        Text: "DEBUG",
        Styles: ["bgBlue"],
      },
    });

    assert(inliner);
    assertEquals(
      inliner.LastInlined,
      "\x1b[104m\x1b[44mDEBUG\x1b[104m \x1b[3mHello\x1b[23m\x1b[49m",
    );
  });

  await t.step("MixedStyles with Suffix", async () => {
    const inliner = new UpdateInline();

    await inliner.Configure({
      Styles: ["bgBrightBlue"],
      Text: {
        Text: "Hello",
        Styles: ["italic"],
      },
      PrefixText: {
        Text: "DEBUG",
        Styles: ["bgBlue"],
      },
      SuffixText: ".......",
    });

    assert(inliner);
    assertEquals(
      inliner.LastInlined,
      "\x1b[104m\x1b[44mDEBUG\x1b[104m \x1b[3mHello\x1b[23m\x1b[49m\n.......",
    );
  });
});
