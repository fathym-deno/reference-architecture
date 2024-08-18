import { assert, assertEquals } from "./test.deps.ts";
import { isStatusSuccess, type Status } from "../src/common/_status.ts";

Deno.test("Status Tests", async (t) => {
  await t.step("Success Test", () => {
    const status: Status = {
      Code: 0,
      Message: "Success",
    };

    assertEquals(status.Code, 0);
    assertEquals(status.Message, "Success");

    assert(isStatusSuccess(status));
  });

  await t.step("Non Success Test", () => {
    const status: Status = {
      Code: 1,
      Message: "General Error",
    };

    assertEquals(status.Code, 1);
    assertEquals(status.Message, "General Error");

    assert(!isStatusSuccess(status));
  });
});
