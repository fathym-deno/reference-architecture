import { BehaviorSubject, Observable, Subject } from "npm:rxjs";
import { Status } from "../status.ts";
import { RealTimeConnection } from "./RealTimeConnection.ts";
import { ObservableContextService } from "./ObservableContextService.ts";

export interface StateAction {
  Arguments: Record<string | number | symbol, unknown>;

  Images?: ImageMessage[];

  Type: string;
}

export interface ImageMessage {
  Data: Record<string | number | symbol, unknown>;

  DataString: string;

  Headers: string;
}

//  TODO:  Need to manage reconnection to hub scenarios here
export abstract class StateContext<T> extends ObservableContextService<T> {
  //  Fields
  protected connectedToState: BehaviorSubject<Status>;

  protected groupName?: string;

  protected rt: RealTimeConnection;

  protected startSub: boolean;

  //  Properties
  public ConnectedToState: Observable<Status>;

  public ReconnectionAttempt: Subject<boolean>;

  //  Constructors
  constructor(
    protected entLookup: string,
    protected stateRoot: string,
    protected stateActionRoot: string,
    protected apiRoot: string,
    protected env?: string,
    protected usernameMock?: string,
  ) {
    super();

    this.connectedToState = new BehaviorSubject<Status>(
      <Status> {
        Code: -1,
        Message: "Initialized",
      },
    );

    this.ConnectedToState = this.connectedToState.asObservable();

    this.startSub = false;

    this.ReconnectionAttempt = new Subject<boolean>();

    const rtUrl = this.buildHubUrl("");

    const actionUrl = this.loadActionUrl("");

    this.rt = new RealTimeConnection(rtUrl, actionUrl);

    this.rt.addListener("ReconnectionAttempt", (val: boolean) => {
      this.ReconnectionAttempt.next(val);
    });

    this.setup();
  }

  //  API Methods
  public Execute(action: StateAction) {
    return this.executeAction(action);
  }

  public $Refresh(args: Record<string | number | symbol, unknown> = {}) {
    this.Execute({
      Arguments: args,
      Type: "Refresh",
    });
  }

  public Start(shouldUpdate: boolean) {
    if (!this.startSub) {
      this.rt.addListener("Started", async () => {
        const groupName = await this.connectToState(shouldUpdate);

        this.setupReceiveState(groupName);

        this.connectedToState.next(<Status> { Code: 0, Message: "Success" });

        this.callRefresh();
      });

      this.rt.Start();
    }
  }

  //  Helpers
  protected buildActionUrl(urlRoot: string) {
    const url = this.loadActionUrl(urlRoot);

    return url;
  }

  protected buildHubUrl(urlRoot: string) {
    const url = this.loadHubUrl(urlRoot);

    return url;
  }

  protected callRefresh() {
    this.$Refresh();
  }

  protected async connectToState(shouldUpdate: boolean): Promise<string> {
    const stateKey = this.loadStateKey();

    const stateName = this.loadStateName();

    const env = this.loadEnvironment();

    const resp = await this.rt.InvokeAction(
      "ConnectToState",
      this.loadHeaders(),
      {
        ShouldSend: shouldUpdate,
        Key: stateKey,
        State: stateName,
        Environment: env,
      },
    );

    const body = await resp.json();

    if (
      (body.status && body.status.code === 0) ||
      (body.Status && body.Status.Code === 0)
    ) {
      return body.groupName;
    } else {
      throw new Error(
        body.status
          ? body.status.message
          : "Unknown issue connecting to state.",
      );
    }
  }

  protected defaultValue(): T {
    return <T> {};
  }

  protected async executeAction(action: StateAction) {
    const stateKey = this.loadStateKey();

    const stateName = this.loadStateName();

    const resp = await this.rt.InvokeAction(action.Type, this.loadHeaders(), {
      ...action,
      Key: stateKey,
      State: stateName,
    });

    return resp;
  }

  protected loadActionPath() {
    const actionRoot = this.loadStateActionRoot();

    return `${actionRoot}`; // ?lcu-app-id=${this.Settings.AppConfig.ID}&lcu-app-ent-lookup=${this.Settings.AppConfig.EnterpriseLookup}`;
  }

  protected loadActionUrl(urlRoot: string) {
    const actionPath = this.loadActionPath();

    return `${this.apiRoot}${urlRoot || ""}${actionPath}`;
  }

  protected loadEnvironment() {
    let env = this.env;

    if (!env) {
      env = "";
    }

    return env;
  }

  protected loadHeaders(): HeadersInit {
    return {
      "lcu-ent-lookup": this.entLookup,
      "lcu-hub-name": this.loadStateName(),
      "lcu-state-key": this.loadStateKey(),
      "lcu-environment": this.loadEnvironment(),
    };
  }

  protected loadHubPath() {
    const stateRoot = this.loadStateRoot();

    const env = this.loadEnvironment();

    const unmock = this.loadUsernameMock();

    return `${stateRoot}?lcu-app-ent-lookup=${this.entLookup}&lcu-environment=${env}&lcu-username-mock=${unmock}`;
  }

  protected loadHubUrl(urlRoot: string) {
    const hubPath = this.loadHubPath();

    return `${this.apiRoot}${urlRoot || ""}${hubPath}`;
  }

  protected abstract loadStateKey(): string;

  protected abstract loadStateName(): string;

  protected loadStateRoot() {
    return `${this.stateRoot}/${this.loadStateName()}`;
  }

  protected loadStateActionRoot() {
    return `${this.stateActionRoot}/${this.loadStateName()}`;
  }

  protected loadUsernameMock() {
    return this.usernameMock;
  }

  protected setup() {
    this.Start(false);
  }

  protected setupReceiveState(groupName: string) {
    this.rt.RegisterHandler(`ReceiveState=>${groupName}`).subscribe((req) => {
      console.log(`Handled state from ${groupName}`);

      this.subject.next(req);
    });
  }
}
