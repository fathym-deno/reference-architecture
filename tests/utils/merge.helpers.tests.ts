// deno-lint-ignore-file no-explicit-any
import { assertEquals } from "../test.deps.ts";
import { merge } from "../../src/common/merge/merge.ts";

Deno.test("Object Helpers Tests", async (t) => {
  await t.step("Merge Test - 2 Objects", () => {
    const a = {
      Code: 0,
      Message: "Failure",
      Complex: {
        Hello: "World",
        Goodbye: "Everyone",
      },
    };

    const b = {
      Message: "Success",
      Complex: {
        Goodbye: "Noone",
      },
    };

    const result: any = merge(a, b);

    assertEquals(result.Code, 0);
    assertEquals(result.Message, "Success");
    assertEquals(result.Complex.Hello, "World");
    assertEquals(result.Complex.Goodbye, "Noone");
  });

  await t.step("Merge Test - 3 Objects", () => {
    const a = {
      Code: 0,
      Message: "Failure",
      Complex: {
        Hello: "World",
        Goodbye: "Everyone",
      },
    };

    const b = {
      Message: "Success",
      Complex: {
        Goodbye: "Noone",
        Deeper: {
          Demand: "Stuff",
          Give: "Nothing",
        },
      },
    };

    const c = {
      Message: "Success",
      Complex: {
        Deeper: {
          Give: "Everything",
        },
      },
    };

    const result: any = merge(a, b, c);

    assertEquals(result.Code, 0);
    assertEquals(result.Message, "Success");
    assertEquals(result.Complex.Hello, "World");
    assertEquals(result.Complex.Goodbye, "Noone");
    assertEquals(result.Complex.Deeper.Demand, "Stuff");
    assertEquals(result.Complex.Deeper.Give, "Everything");
  });
});
