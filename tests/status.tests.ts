import { assert, describe } from "./test.deps.ts";
import { assertEquals } from "$std/testing/asserts.ts";
import { isStatusSuccess, Status } from "../src/status.ts";

describe("Status Tests", () => {
  describe("Success Test", () => {
    const status: Status = {
      Code: 0,
      Message: "Success",
    };

    assertEquals(status.Code, 0);
    assertEquals(status.Message, "Success");

    assert(isStatusSuccess(status));
  });

  describe("Non Success Test", () => {
    const status: Status = {
      Code: 1,
      Message: "General Error",
    };

    assertEquals(status.Code, 1);
    assertEquals(status.Message, "General Error");

    assert(!isStatusSuccess(status));
  });
});
