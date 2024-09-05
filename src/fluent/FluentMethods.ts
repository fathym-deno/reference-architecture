// deno-lint-ignore-file no-explicit-any
import type { $FluentTagOptions } from './types/tags/$FluentTagOptions.ts';

export function FluentMethods(type: $FluentTagOptions<'Methods'>) {
  return function (
    target: any,
    propertyKey: string | symbol,
    _ctx: ClassFieldDecoratorContext<any, any>
  ) {
    // Add metadata to the target's property
    target[propertyKey] = {
      ...target[propertyKey],
      '|FluentMethods': type,
    };
  };
}
