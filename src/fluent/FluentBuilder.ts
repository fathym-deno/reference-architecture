// deno-lint-ignore-file no-explicit-any
import { readStringDelim } from 'jsr:@std/io@^0.224.6/read-string-delim';
import { jsonMapSetClone, type ValueType } from './.deps.ts';
import type { $FluentTagDeepStrip, $FluentTagTypeOptions } from './.exports.ts';
import type { IsFluentBuildable } from './types/IsFluentBuildable.ts';
import type { SelectFluentMethods } from './types/SelectFluentMethods.ts';

export function fluentBuilder<TBuilderModel>(
  model?: IsFluentBuildable<TBuilderModel>
): FluentBuilder<TBuilderModel> &
  SelectFluentMethods<TBuilderModel, TBuilderModel> {
  return new FluentBuilder<TBuilderModel>(
    [],
    model
  ) as FluentBuilder<TBuilderModel> &
    SelectFluentMethods<TBuilderModel, TBuilderModel>;
}

/**
 * A dynamic, Proxy based, Fluent API builder. It handles all of the data management when using the Fluent API methods. Supports defining custom handlers to invoke in varying scopes.
 */
export class FluentBuilder<TBuilderModel> {
  // #region Fields
  protected handlers: {
    [handlerName: string]: (...args: unknown[]) => unknown;
  };

  protected keyDepth: string[];

  protected model: TBuilderModel;
  // #endregion

  // #region Constructors
  constructor(
    keyDepth?: string[],
    model?: TBuilderModel,
    handlers?: typeof this.handlers
  ) {
    this.handlers = handlers || {};

    this.keyDepth = keyDepth || [];

    this.model = model || ({} as TBuilderModel);

    return this.createProxy();
  }
  // #endregion

  // #region API Methods
  public Export(): $FluentTagDeepStrip<TBuilderModel, $FluentTagTypeOptions> {
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

    return newModel as $FluentTagDeepStrip<
      TBuilderModel,
      $FluentTagTypeOptions
    >;
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
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target.handlers) {
          return (...args: unknown[]) => {
            return target.executeHandlers(target, prop, receiver, args);
          };
        } else if (prop in target) {
          return target.executeActual(target, prop, receiver);
        } else {
          return (...args: unknown[]) => {
            return target.executeVirtual(target, prop, receiver, args);
          };
        }
      },
    }) as this;
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
    _receiver: any,
    ...args: unknown[]
  ): unknown {
    return this.handlers[prop.toString()].call(target, ...args);
  }

  protected executeVirtual(
    target: this,
    prop: string | symbol,
    receiver: any,
    args: unknown[]
  ): FluentBuilder<TBuilderModel> {
    let result: ReturnType<typeof this.executeVirtualObject> = undefined;
    // {
    //   Keys: [],
    //   Prop: prop.toString(),
    //   Value: undefined,
    // } as NonNullable<ReturnType<typeof target.executeVirtualObject>>;

    // if (args?.length) {
    //   if (result.Prop.toString().startsWith('_')) {
    //     result.Prop = result.Prop.toString().slice(1);

    //     const [lookup] = args as [string];

    //     result.Keys.push(...[result.Prop, lookup]);

    //     result.Value = target.workingRecords()[result.Prop] ?? {};

    //     if (!(lookup in (result.Value as Record<string, unknown>))) {
    //       (result.Value as Record<string, unknown>)[lookup] = {};
    //     }
    //   } else {
    //     const [value] = args;

    //     result.Value = value;
    //   }
    // } else {
    //   result.Keys.push(result.Prop);

    //   result.Value = target.workingRecords()[result.Prop] ?? {};
    // }

    const workers = [
      this.executeVirtualObject, //(target, prop, receiver, args);
      this.executeVirtualProperty, //(target, prop, receiver, args);
      this.executeVirtualRecord, //(target, prop, receiver, args);
    ];

    result = workers.reduce(
      (result, worker) => {
        const {
          Keys: newKeys,
          Prop: newProp,
          Value: newValue,
        } = worker(target, prop, receiver, args);

        return {
          Keys: (result.Keys.length ? result.Keys : newKeys) ?? [],
          Prop: result.Prop ?? newProp,
          Value: result.Value ?? newValue,
        };
      },
      result
    );

    if (!result) {
      console.log(result);
    }

    target.workingRecords()[result.Prop] = result.Value;

    return new FluentBuilder<TBuilderModel>(
      [...target.keyDepth, ...result.Keys],
      target.model
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

  protected workingRecords(): Record<string, unknown> {
    return this.keyDepth.reduce((working, nextKey) => {
      working = working[nextKey] as Record<string, unknown>;

      return working;
    }, this.model as Record<string, unknown>);
  }
  // #endregion
}
