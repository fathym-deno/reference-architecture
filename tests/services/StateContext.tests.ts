import { assert, describe } from "../test.deps.ts";
import { StateContext } from "../../src/services/StateContext.ts";

describe("StateContext Tests", () => {
  interface TestState {
    hello: string;
  }

  class TestStateContext extends StateContext<TestState> {
    constructor(
      protected entLookup: string,
      protected stateRoot: string,
      protected stateActionRoot: string,
      protected apiRoot: string,
      protected env?: string,
      protected usernameMock?: string,
    ) {
      super(entLookup, stateRoot, stateActionRoot, apiRoot, env, usernameMock);
    }

    protected loadStateKey(): string {
      return "shared";
    }

    protected loadStateName(): string {
      return "iotensemble";
    }
  }

  describe("StateContext Test", () => {
    const sc = new TestStateContext(
      "xxx",
      "/api/state",
      "/api/state",
      "http://localhost/",
      "local",
      "",
    );

    assert(sc);
  });
});
