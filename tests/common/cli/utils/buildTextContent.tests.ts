import { buildTextContent } from "../../../../src/common/cli/utils/buildTextContent.ts";
import { assertEquals } from "../../../test.deps.ts";
import { assert } from "../../../test.deps.ts";

Deno.test("Build Text Content Tests", async (t) => {
  await t.step("Only Text", async () => {
    const result = await buildTextContent("Hello");

    console.log(result);

    assert(result);
    assertEquals(result, "\x1b[0mHello\x1b[0m");
  });

  await t.step("Only Text - System Style", async () => {
    const result = await buildTextContent("Hello", "bgBlue");

    console.log(result);

    assert(result);
    assertEquals(result, "\x1b[0m\x1b[44m Hello \x1b[49m\x1b[0m");
  });

  await t.step("Only Text - System Styles", async () => {
    const result = await buildTextContent("Hello", ["bgBlue", "red"]);

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[31m\x1b[44m Hello \x1b[49m\x1b[39m\x1b[0m",
    );
  });

  await t.step("Only Text - System Styles with RGB", async () => {
    const result = await buildTextContent("Hello", [
      "bgRgb24:74:145:142",
      "black",
      "italic",
      "strikethrough",
    ]);

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[9m\x1b[3m\x1b[30m\x1b[48;2;74;145;142m Hello \x1b[49m\x1b[39m\x1b[23m\x1b[29m\x1b[0m",
    );
  });

  await t.step("TextContent - Content Style", async () => {
    const result = await buildTextContent({
      Text: "Hello",
      Styles: "bgBlue",
    });

    console.log(result);

    assert(result);
    assertEquals(result, "\x1b[0m\x1b[44m Hello \x1b[49m\x1b[0m");
  });

  await t.step("TextContent - Content Styles", async () => {
    const result = await buildTextContent({
      Text: "Hello",
      Styles: ["bgBlue", "red"],
    });

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[31m\x1b[44m Hello \x1b[49m\x1b[39m\x1b[0m",
    );
  });

  await t.step("TextContent - Content Styles with RGB", async () => {
    const result = await buildTextContent({
      Text: "Hello",
      Styles: ["bgRgb24:74:145:142", "black", "italic", "strikethrough"],
    });

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[9m\x1b[3m\x1b[30m\x1b[48;2;74;145;142m Hello \x1b[49m\x1b[39m\x1b[23m\x1b[29m\x1b[0m",
    );
  });

  await t.step("TextContent - Mixed Styles", async () => {
    const result = await buildTextContent(
      {
        Text: "Hello",
        Styles: "bgBlue",
      },
      "red",
    );

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[31m\x1b[44m Hello \x1b[49m\x1b[39m\x1b[0m",
    );
  });

  await t.step("TextContent - Mixed Styles with RGB - 1", async () => {
    const result = await buildTextContent(
      {
        Text: "Hello",
        Styles: "bgRgb24:74:145:142",
      },
      ["black", "italic", "strikethrough"],
    );

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[9m\x1b[3m\x1b[30m\x1b[48;2;74;145;142m Hello \x1b[49m\x1b[39m\x1b[23m\x1b[29m\x1b[0m",
    );
  });

  await t.step("TextContent - Mixed Styles with RGB - 1", async () => {
    const result = await buildTextContent(
      {
        Text: "Hello",
        Styles: ["bgRgb24:74:145:142", "black"],
      },
      ["italic", "strikethrough"],
    );

    console.log(result);

    assert(result);
    assertEquals(
      result,
      "\x1b[0m\x1b[9m\x1b[3m\x1b[30m\x1b[48;2;74;145;142m Hello \x1b[49m\x1b[39m\x1b[23m\x1b[29m\x1b[0m",
    );
  });

  await t.step(
    "TextContent - Mixed Styles - Content beats System",
    async () => {
      const result = await buildTextContent(
        {
          Text: "Hello",
          Styles: ["bgBlue", "red"],
        },
        "bgYellow",
      );

      console.log(result);

      assert(result);
      assertEquals(
        result,
        "\x1b[0m\x1b[43m\x1b[31m\x1b[44m Hello \x1b[43m\x1b[39m\x1b[49m\x1b[0m",
      );
    },
  );
});
