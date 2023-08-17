// deno-lint-ignore-file no-explicit-any
import * as signalR from "npm:@aspnet/signalr";
import { EventEmitter } from "node:events";

import { Observable } from "npm:rxjs";

export class RealTimeConnection extends EventEmitter {
  //  Fields
  protected actionUrl: string;

  protected connectionAttempts: number;

  protected rtUrl: string;

  //  Properties
  // public ConnectionError: EventEmitter<any>;

  public Hub?: signalR.HubConnection;

  public MaxConnectionRetryAttempts: number;

  //  Constructors
  constructor(
    rtUrl: string,
    actionUrl: string,
    maxConnectionRetryAttempts: number = 10,
  ) {
    super();

    this.actionUrl = actionUrl;

    this.connectionAttempts = 0;

    this.rtUrl = rtUrl;

    this.MaxConnectionRetryAttempts = maxConnectionRetryAttempts;
  }

  //  API Methods
  public Start(
    transport: signalR.HttpTransportType = signalR.HttpTransportType.WebSockets,
  ) {
    this.Hub = this.buildHub(transport);

    this.Hub.serverTimeoutInMilliseconds = 600000;

    this.Hub.onclose((err) => {
      console.log("onclose: " + err);

      this.retryConnection();
    });

    try {
      this.Hub.start()
        .then(() => {
          this.connectionAttempts = 0;

          console.log(`Connection started`);

          this.emit("Started", this.Hub);
        })
        .catch((err: any) => {
          console.log("Error while starting connection: " + err);

          this.emit("ConnectionError", err);

          this.retryConnection();
        });
    } catch (err) {
      console.log("Error while starting connection: " + err);

      this.retryConnection();
    }
  }

  public RegisterHandler(methodName: string): Observable<any> {
    return new Observable((obs) => {
      if (this.Hub) {
        try {
          this.Hub.on(methodName, (req: any) => {
            obs.next(req);
          });
        } catch (err) {
          console.log(`Error while handling ${methodName}: ` + err);

          obs.error(err);
        }
      } else {
        obs.error(
          "The hub must be started and configured before registering a handler.",
        );
      }
    });
  }

  public async InvokeAction(
    methodName: string,
    headers: HeadersInit | undefined,
    args: Record<string | number | symbol, unknown>,
  ) {
    const url = `${this.actionUrl}/${methodName}`;

    return await fetch(url, {
      body: JSON.stringify(args),
      method: "post",
      headers,
      // withCredentials: true,
      // observe: "response",
    });
  }

  public Invoke(methodName: string, ...args: any[]) {
    return new Observable((obs) => {
      if (this.Hub) {
        try {
          this.Hub.invoke(methodName, ...args)
            .then((res: unknown) => {
              obs.next(res);
            })
            .catch((e: any) => {
              obs.error(e);
            });
        } catch (err) {
          console.log(`Error while invoking ${methodName}: ` + err);

          obs.error(err);
        }
      } else {
        obs.error("The hub must be started and configured before invoking.");
      }
    });
  }

  //  Helpers
  protected buildHub(transport: signalR.HttpTransportType) {
    return new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.rtUrl, {
        transport,
      })
      .build();
  }

  protected stop(): Promise<void> {
    return this.Hub!.stop();
  }

  /**
   * Retry connection
   */
  protected retryConnection(): void {
    if (this.connectionAttempts < this.MaxConnectionRetryAttempts) {
      console.log(`Retrying connection attempt ${this.connectionAttempts}`);

      this.connectionAttempts += 1;

      setTimeout(() => {
        this.reconnect();
      }, 1000);
    } else if (this.connectionAttempts >= this.MaxConnectionRetryAttempts) {
      this.stop().then();

      this.emit(
        "ConnectionError",
        "The maximum number of connection retries has been met.",
      );
    }
  }

  /**
   * Attempt to reconnect
   */
  protected reconnect(): void {
    this.emit("ReconnectionAttempt", this.connectionAttempts);

    this.Start();
  }
}
