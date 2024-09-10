// deno-lint-ignore-file no-explicit-any
import { jsonMapSetClone, type ValueType } from './.deps.ts';
import type { FluentBuilderRoot } from './FluentBuilderRoot.ts';
import type { FluentBuilderMethodsHandlers } from './types/FluentBuilderMethodsHandlers.ts';
import type { SelectFluentMethods } from './types/SelectFluentMethods.ts';

export function fluentBuilder<TBuilderModel>(
  model?: TBuilderModel,
  handlers?: FluentBuilderMethodsHandlers
): FluentBuilder<TBuilderModel> &
  SelectFluentMethods<FluentBuilderRoot<TBuilderModel>, TBuilderModel> {
  return new FluentBuilder<TBuilderModel>(
    [],
    model,
    handlers
  ) as FluentBuilder<TBuilderModel> &
    SelectFluentMethods<FluentBuilderRoot<TBuilderModel>, TBuilderModel>;
}

/**
 * A dynamic, Proxy based, Fluent API builder. It handles all of the data management when using the Fluent API methods. Supports defining custom handlers to invoke in varying scopes.
 */
export class FluentBuilder<TBuilderModel> {
  // #region Fields
  protected readonly handlers: FluentBuilderMethodsHandlers;

  protected readonly keyDepth: string[];

  protected readonly model: FluentBuilderRoot<TBuilderModel>;
  // #endregion

  // #region Constructors
  constructor(
    keyDepth?: string[],
    model?: TBuilderModel,
    handlers?: FluentBuilderMethodsHandlers
  ) {
    this.handlers = handlers || {};

    this.keyDepth = keyDepth || [];

    this.model = { Root: model || ({} as TBuilderModel) } as typeof this.model;

    const callable = (...args: any[]) => {
      // Logic to be executed when FluentBuilder is called
    };

    // Add properties to the callable function
    Object.setPrototypeOf(callable, this);

    return this.createProxy();
  }
  // #endregion

  // #region API Methods
  public Export<TExport extends TBuilderModel = TBuilderModel>(): TExport {
    const newModel = jsonMapSetClone(this.model) as Record<string, unknown>;

    let eacWorking = newModel as Record<string, unknown>;

    this.keyDepth.forEach((nextKey) => {
      const workingProps = Object.keys(eacWorking ?? {});

      workingProps.forEach((key) => {
        if (key !== nextKey) {
          delete (eacWorking as any)[key];
        }
      });

      eacWorking = eacWorking[nextKey] as Record<string, unknown>;
    });

    return newModel?.['Root'] as TExport;
  }

  public With(
    action: (x: this) => void
  ): this &
    SelectFluentMethods<
      ValueType<ReturnType<typeof this.workingRecords>>,
      TBuilderModel
    > {
    action(this);

    return this as this &
      SelectFluentMethods<
        ValueType<ReturnType<typeof this.workingRecords>>,
        TBuilderModel
      >;
  }
  // #endregion

  // #region Helpers
  protected createProxy(): this {
    Object.assign(
      this,
      (...args: any[]) => {
        return new Deno.errors.NotSupported(
          'This method should be covered up by the proxy.'
        );
      },
      this,
      FluentBuilder.prototype
    );

    return new Proxy(this, this.loadProxyHandler() as any) as this;
  }

  protected executeActual(
    target: this,
    prop: string | symbol,
    receiver: any
  ): unknown {
    return Reflect.get(target, prop, receiver);
  }

  protected executeHandlers(
    target: this,
    prop: string | symbol,
    _receiver: any
  ): unknown {
    return (...args: unknown[]) => {
      return this.handlers[prop.toString()].call(target, ...args);
    };
  }

  protected executeVirtual(
    target: this,
    prop: string | symbol,
    receiver: any,
    keys?: string[]
  ): unknown {
    return new Proxy(
      () => {
        throw new Deno.errors.NotSupported(
          'The Proxy should be taking over the actual method execution.'
        );
      },
      {
        get(virtualTarget, virtualProp, virtualReceiver) {
          if (virtualProp in virtualTarget) {
            return Reflect.get(virtualTarget, virtualProp, virtualReceiver);
          } else if (virtualProp.toString().startsWith('$')) {
            return target.loadProxyHandler([
              prop.toString(),
              // virtualProp.toString(),
            ]).get!(target, virtualProp, receiver);
          } else {
            return target;
          }
        },

        apply(_virtualTarget, _virtualReceiver, virtualArgs) {
          let result: ReturnType<typeof target.executeVirtualObject> =
            undefined;

          result = target.executeVirtualRecord(
            target,
            prop,
            receiver,
            virtualArgs
          );

          const isRecord = !!result;

          result ??= target.executeVirtualObject(
            target,
            prop,
            receiver,
            virtualArgs
          );

          const isObj = !isRecord && !!result;

          result ??= target.executeVirtualProperty(
            target,
            prop,
            receiver,
            virtualArgs
          );

          const isProp = !isRecord && !!result;

          if (!result) {
            throw new Error(
              `Property '${prop.toString()}' was not properly resolved.`
            );
          }

          const currentKeyDepth = [
            ...(keys ?? []),
            ...(isProp
              ? [result.Prop]
              : isRecord
              ? result.Keys.slice(0, -1)
              : result.Keys),
          ];

          const cleanKeys: string[] = currentKeyDepth.map((k) =>
            k.startsWith('_') ? k.slice(1).toString() : k
          );

          cleanKeys.reduce((working, key, i) => {
            if (i === cleanKeys.length - 1) {
              working[key] = result.Value;
            } else {
              working[key] ??= {};
            }

            return working[key] as any;
          }, target.workingRecords() as Record<string, unknown>);

          const nextKeyDepth = [
            ...target.keyDepth,
            ...(keys ?? []).map((k) => (k.startsWith('_') ? k.slice(1) : k)),
            ...result.Keys,
          ];

          const bldr = new FluentBuilder<TBuilderModel>(
            nextKeyDepth,
            target.model['Root'],
            target.handlers
          );

          // const nextBldrs: Record<string, FluentBuilder<TBuilderModel>> = {};

          return bldr;
          // return new Proxy(bldr, target.loadProxyHandler()) ;
          // return true //!isRecord
          //   ? bldr
          //   : new Proxy(
          //       // () => {
          //       //   throw new Deno.errors.NotSupported(
          //       //     'The Proxy should be taking over the actual method execution.'
          //       //   );
          //       // },
          //       bldr,
          //       {
          //         // get(_bldrTarget, bldrProp, _bldrReceiver) {
          //         //   const nextKeyDepth = [
          //         //     ...target.keyDepth,
          //         //     ...(keys ?? []).map((k) =>
          //         //       k.startsWith('_') ? k.slice(1) : k
          //         //     ),
          //         //     ...result.Keys,
          //         //     bldrProp.toString(),
          //         //   ];

          //         //   const bldr = (nextBldrs[bldrProp.toString()] =
          //         //     nextBldrs[bldrProp.toString()] ??
          //         //     new FluentBuilder<TBuilderModel>(
          //         //       nextKeyDepth,
          //         //       target.model['Root'],
          //         //       target.handlers
          //         //     ));

          //         //   return (bldr as any)[bldrProp as string];
          //         // },

          //         apply(_bldrTarget, bldrReceiver, bldrArgs) {
          //           // const nextKeyDepth = [
          //           //   ...target.keyDepth,
          //           //   ...(keys ?? []).map((k) =>
          //           //     k.startsWith('_') ? k.slice(1) : k
          //           //   ),
          //           //   ...result.Keys,
          //           // ];

          //           // const bldr = new FluentBuilder<TBuilderModel>(
          //           //   nextKeyDepth,
          //           //   target.model['Root'],
          //           //   target.handlers
          //           // );

          //           // return (bldr as any).apply(bldr, bldrArgs);
          //           return target.executeVirtual(
          //             target,
          //             bldrArgs[0],
          //             bldrReceiver
          //           );
          //         },
          //       }
          //     );
        },
      }
    );
  }

  protected executeVirtualObject(
    target: this,
    prop: string | symbol,
    _receiver: any,
    args: unknown[]
  ): { Keys: string[]; Prop: string; Value: unknown } | undefined {
    const newKeys: string[] = [];

    let newValue: unknown;

    if (!args?.length) {
      newKeys.push(prop.toString());

      newValue = target.workingRecords()[prop.toString()] ?? {};
    }

    return newValue
      ? { Keys: newKeys, Prop: prop.toString(), Value: newValue }
      : undefined;
  }

  protected executeVirtualProperty(
    _target: this,
    prop: string | symbol,
    _receiver: any,
    args: unknown[]
  ): ReturnType<typeof this.executeVirtualObject> {
    const newKeys: string[] = [];

    let newValue: unknown = undefined;

    if (args?.length && !prop.toString().startsWith('_')) {
      const [value] = args;

      newValue = value;
    }

    return newValue
      ? { Keys: newKeys, Prop: prop.toString(), Value: newValue }
      : undefined;
  }

  protected executeVirtualRecord(
    target: this,
    prop: string | symbol,
    _receiver: any,
    args: unknown[]
  ): ReturnType<typeof this.executeVirtualObject> {
    const newKeys: string[] = [];

    let newValue: unknown = undefined;

    if (args?.length && prop.toString().startsWith('_')) {
      prop = prop.toString().slice(1);

      const [lookup] = args as [string];

      newKeys.push(...[prop, lookup]);

      newValue = target.workingRecords()[prop] ?? {};

      if (!(lookup in (newValue as Record<string, unknown>))) {
        (newValue as Record<string, unknown>)[lookup] = {};
      }
    }

    return newValue
      ? { Keys: newKeys, Prop: prop.toString(), Value: newValue }
      : undefined;
  }

  protected loadProxyHandler(keys?: string[]): ProxyHandler<this> {
    return {
      get(target, prop, receiver) {
        if (prop in (target.handlers ?? {})) {
          return target.executeHandlers(target, prop, receiver);
        } else if (prop in target) {
          return target.executeActual(target, prop, receiver);
        } else {
          return target.executeVirtual(target, prop, receiver, keys);
        }
      },

      apply(target, receiver, args) {
        // const nextKeyDepth = [
        //   ...target.keyDepth,
        //   ...(keys ?? []).map((k) =>
        //     k.startsWith('_') ? k.slice(1) : k
        //   ),
        //   ...result.Keys,
        // ];

        // const bldr = new FluentBuilder<TBuilderModel>(
        //   nextKeyDepth,
        //   target.model['Root'],
        //   target.handlers
        // );

        // return (bldr as any).apply(bldr, bldrArgs);
        // return target.executeVirtual(
        //   target,
        //   bldrArgs[0],
        //   bldrReceiver
        // );
        throw new Error();
      },
    };
  }

  protected workingRecords(): Record<string, unknown> {
    return this.keyDepth.reduce((working, nextKey) => {
      try {
        working = working[nextKey] as Record<string, unknown>;

        return working;
      } catch (err) {
        console.log(nextKey);

        throw err;
      }
    }, this.model as Record<string, unknown>);
  }
  // #endregion
}
