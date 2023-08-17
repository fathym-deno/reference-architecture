import { assert, describe } from "../test.deps.ts";
import { ObservableContextService } from "../../src/services/ObservableContextService.ts";

describe("ObservableContextService Tests", () => {
  class TestObservableContextService
    extends ObservableContextService<string | undefined> {
    constructor() {
      super();
    }

    public Set(value: string): void {
      this.subject.next(value);
    }

    protected override defaultValue(): string | undefined {
      return undefined;
    }
  }

  describe("ObservableContextService Test", () => {
    const svc = new TestObservableContextService();

    const subd: (string | undefined)[] = [];

    svc.Context.subscribe((v) => {
      subd.push(v);
    });

    svc.Set("Hello");

    svc.Set("World");

    assert(subd.indexOf(undefined) >= 0);
    assert(subd.indexOf("Hello") >= 0);
    assert(subd.indexOf("World") >= 0);
  });
});
