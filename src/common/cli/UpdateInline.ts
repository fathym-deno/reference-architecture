import { merge } from "./.deps.ts";
import type { UpdateInlineOptions } from "./UpdateInlineOptions.ts";
import { appendStyles } from "./utils/appendStyles.ts";
import { buildTextContent } from "./utils/buildTextContent.ts";

export class UpdateInline {
  // #region Fields
  protected get lineCount(): number {
    // TODO(mcgear): Add lines based on line breaks in text combined with prefix and possible spinner and max columns (chars per line)
    let lineCount = this.options.LineCount || 1;

    if (this.options.SuffixText) {
      // TODO(mcgear): Add lines based on line breaks and max columns (chars per line)
      lineCount++;
    }

    return lineCount;
  }

  protected options: UpdateInlineOptions;

  protected textEncoder: TextEncoder;

  protected timeout: AbortController;
  // #endregion

  // #region Properties
  public LastInlined: string;
  // #endregion

  constructor() {
    this.LastInlined = "";

    this.options = {};

    this.textEncoder = new TextEncoder();

    this.timeout = new AbortController();
  }

  // #region API Methods
  public async Configure(options: UpdateInlineOptions | string): Promise<this> {
    if (typeof options === "string") {
      options = { Text: options };
    }

    this.options = merge(this.options ?? {}, options ?? {});

    if (
      !(typeof this.options.Spinner === "undefined") &&
      !(typeof this.options.Spinner === "boolean")
    ) {
      throw new Deno.errors.NotSupported(
        "Custom spinner frames are not yet supported.",
      );
    }

    await this.render();

    return this;
  }
  // #endregion

  // #region Helpers
  protected async render(): Promise<void> {
    let styles = this.options.Styles;

    if (styles && !Array.isArray(styles)) {
      styles = [styles];
    }

    const [text, prefix, suffix] = await Promise.all([
      buildTextContent(this.options.Text),
      buildTextContent(this.options.PrefixText),
      buildTextContent(this.options.SuffixText),
    ]);

    const lines: string[][] = [];

    lines.push([
      ...(prefix ? [prefix] : []),
      // ...(spinner ? [spinner] : []),
      ...(text ? [text] : []),
    ]);

    lines.push([...(suffix ? [suffix] : [])]);

    const result = lines.reduce((res, line) => {
      let fullLine = "";

      if (line?.length) {
        fullLine = line.join(this.options.LineSpacer || " ");

        if (fullLine && line === lines[0]) {
          fullLine = styles?.reduce((txt, nextStyle) => {
            return appendStyles(txt, nextStyle);
          }, fullLine) ?? fullLine;
        }
      }

      return !fullLine ? res : !res ? fullLine : `${res}\n${fullLine}`;
    }, "");

    await (this.options.Writer || Deno.stdout).write(
      this.textEncoder.encode(`${result}\n`),
    );

    this.LastInlined = result;
  }
  // #endregion
}
