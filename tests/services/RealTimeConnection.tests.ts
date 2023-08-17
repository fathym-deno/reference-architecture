import { assert, describe } from "../test.deps.ts";
import { RealTimeConnection } from "../../src/services/RealTimeConnection.ts";

describe("RealTimeConnection Tests", () => {
  describe("RealTimeConnection Test", () => {
    const rt = new RealTimeConnection("http://localhost", "actions", 5);

    assert(rt);
  });
});
