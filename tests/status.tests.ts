import { assert, describe } from "./test.deps.ts";
import { assertEquals } from "$std/testing/asserts.ts";
import { isStatusSuccess, Status } from "../src/status.ts";

describe("Status Tests", () => {
  describe("Change Name Test", () => {
    const status: Status = {
      Code: 0,
      Message: "Success",
    };

    assertEquals(status.Code, 0);
    assertEquals(status.Message, "Success");

    assert(isStatusSuccess(status));
  });
});
