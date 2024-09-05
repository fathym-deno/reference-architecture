import { type $FluentTag, fluentBuilder } from "../../src/fluent/.exports.ts";
import { assert, assertEquals, assertFalse } from "../test.deps.ts";

Deno.test("Fluent Builder Tests", async (t) => {
  await t.step("Basic Tests", async (t) => {
    const bldr = fluentBuilder<{ Hello: string }>();

    await t.step("Object with Property", () => {
      const value = bldr.Hello("World").Export();

      assert(value);
      assertEquals(value.Hello, "World");
    });
  });

  await t.step("Basic", async (t) => {
    type fluentTest = {
      Hello: string;
      Nested: {
        Goodbye: string;
      };
      NestedProp: {
        Speak: string;
      } & $FluentTag<"Methods", "Property">;
      NestedRecord: Record<
        string,
        {
          BringIt: boolean;
        }
      >;
    };

    await t.step("Object with Property", () => {
      const bldr = fluentBuilder<fluentTest>();

      const value = bldr.Hello("World").Export();

      assert(value);
      assertEquals(value.Hello, "World");
    });

    await t.step("Nested Object with Property", () => {
      const bldr = fluentBuilder<fluentTest>();

      bldr.Hello("World");

      bldr.Nested().Goodbye("Friend");

      const whole = bldr.Export();

      assert(whole);
      assertEquals(whole.Hello, "World");
      assertEquals(whole.Nested.Goodbye, "Friend");

      const partial = bldr.Nested().Export();

      assert(partial);
      assertFalse(partial.Hello);
      assertEquals(partial.Nested.Goodbye, "Friend");
    });

    await t.step("Nested Record with Property", () => {
      const bldr = fluentBuilder<fluentTest>();

      bldr.Hello("World");

      const record = {
        $test: "Hello World",
      };

      console.log(record.$test);

      bldr._NestedRecord("TestKey").BringIt(true);

      const whole = bldr.Export();

      console.log(whole);
      assert(whole);
      assertEquals(whole.Hello, "World");
      assert(whole.NestedRecord["TestKey"].BringIt);
      assertFalse(whole.NestedRecord["@Methods"]);

      const partial = bldr._NestedRecord("TestKey").Export();

      assert(partial);
      assertFalse(partial.Hello);
      assert(whole.NestedRecord["TestKey"].BringIt);
    });
  });
});
