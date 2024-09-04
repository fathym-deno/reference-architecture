import { IsObject, jsonMapSetClone, type ValueType } from './.deps.ts';
import type { SelectFluentMethods } from './types/SelectFluentMethods.ts';

/**
 * Determines if an intial input is able to be used in a FluentBuilder.
 */
export type IsFluentBuildable<TBuilderModel> = IsObject<TBuilderModel> extends true
  ? TBuilderModel
  : never;

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
    [handlerName: string | symbol]: (...args: unknown[]) => unknown;
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
  public Export(): TBuilderModel {
    const newModel = jsonMapSetClone(this.model) as Record<string, unknown>;

    let eacWorking = newModel as Record<string, unknown>;

    this.keyDepth.forEach((nextKey) => {
      const workingProps = Object.keys(eacWorking ?? {});

      workingProps.forEach((key) => {
        if (key !== nextKey) {
          // deno-lint-ignore no-explicit-any
          delete (eacWorking as any)[key];
        }
      });

      eacWorking = eacWorking[nextKey] as Record<string, unknown>;
    });

    return newModel as TBuilderModel;
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
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        if (prop in target.handlers) {
          return (...args: unknown[]) =>
            target.handlers[prop].call(target, args);
        } else {
          return (...args: unknown[]) => {
            const newKeys: string[] = [];

            let newValue: unknown;

            if (args?.length) {
              if (
                typeof target.workingRecords() === 'object' &&
                'Details' in target.workingRecords() &&
                typeof target.workingRecords().Details !== 'undefined'
              ) {
                const [lookup] = args as [string];

                newKeys.push(...[prop.toString(), lookup]);

                newValue = target.workingRecords()[prop.toString()] ?? {};

                if (!(lookup in (newValue as Record<string, unknown>))) {
                  (newValue as Record<string, unknown>)[lookup] = {};
                }
              } else {
                const [value] = args;

                newValue = value;
              }
            } else {
              newKeys.push(prop.toString());

              newValue = target.workingRecords()[prop.toString()] ?? {};
            }

            target.workingRecords()[prop.toString()] = newValue;

            return new FluentBuilder<TBuilderModel>(
              [...target.keyDepth, ...newKeys],
              target.model
            );
          };
        }
      },
    }) as this;
  }

  protected workingRecords(): Record<string, unknown> {
    return this.keyDepth.reduce((working, nextKey) => {
      working = working[nextKey] as Record<string, unknown>;

      return working;
    }, this.model as Record<string, unknown>);
  }
  // #endregion
}
