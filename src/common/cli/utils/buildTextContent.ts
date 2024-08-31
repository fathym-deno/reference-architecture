import { toText } from "../.deps.ts";
import type { StyleOptions } from "../StyleKeys.ts";
import type { TextContent } from "../TextContent.ts";
import { appendStyles } from "./appendStyles.ts";

export async function buildTextContent(
  content?: string | TextContent,
): Promise<string> {
  let result = "";

  if (content) {
    if (typeof content === "string") {
      content = { Text: content };
    }

    const contentStyles: StyleOptions[] =
      (!content.Styles || Array.isArray(content.Styles)
        ? content.Styles
        : [content.Styles]) || [];

    result = typeof content.Text === "string"
      ? content.Text
      : await toText(content.Text);

    result = contentStyles?.reduce((txt, nextStyle) => {
      return appendStyles(txt, nextStyle);
    }, result) ?? result;

    result = `${result}`;
  }

  return result;
}
