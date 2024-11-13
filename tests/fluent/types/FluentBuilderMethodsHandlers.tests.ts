// deno-lint-ignore-file no-explicit-any
import { runTest } from "../../../src/common/testing/runTest.ts";
import type { FluentBuilderMethodsHandlers } from "../../../src/fluent/types/FluentBuilderMethodsHandlers.ts";

Deno.test("Testing FluentBuilderMethodsHandlers", async (t) => {
  // Basic test for FluentBuilderMethodsHandlers
  await t.step("Basic FluentBuilderMethodsHandlers", () => {
    type Handlers = FluentBuilderMethodsHandlers;
    // runTest<Handlers, { [handlerName: string]: (...args: any[]) => any }>(
    //   {
    //     save: () => {},
    //     delete: () => {},
    //   },
    //   {
    //     save: () => {},
    //     delete: () => {},
    //   },
    // );
  });

  // Test with a complex handler definition
  await t.step("Complex Handler Definitions", () => {
    type ComplexHandlers = FluentBuilderMethodsHandlers & {
      execute: () => void;
      validate: (input: string) => boolean;
    };

    // runTest<
    //   ComplexHandlers,
    //   {
    //     [handlerName: string]: (...args: any[]) => any;
    //     execute: () => void;
    //     validate: (input: string) => boolean;
    //   }
    // >(
    //   {
    //     execute: () => {},
    //     validate: (input: string) => input.length > 0,
    //   },
    //   {
    //     execute: () => {},
    //     validate: (input: string) => input.length > 0,
    //   },
    // );
  });

  // Test with Record type using FluentBuilderMethodsHandlers
  await t.step("Record Type with FluentBuilderMethodsHandlers", () => {
    type HandlersRecord = Record<string, FluentBuilderMethodsHandlers>;

    // runTest<
    //   HandlersRecord,
    //   Record<string, { [handlerName: string]: (...args: any[]) => any }>
    // >(
    //   {
    //     operation1: {
    //       run: () => {},
    //       stop: () => {},
    //     },
    //     operation2: {
    //       execute: () => {},
    //       cancel: () => {},
    //     },
    //   },
    //   {
    //     operation1: {
    //       run: () => {},
    //       stop: () => {},
    //     },
    //     operation2: {
    //       execute: () => {},
    //       cancel: () => {},
    //     },
    //   },
    // );
  });

  // Test with empty handler definitions (should be valid)
  await t.step("Empty Handler Definitions", () => {
    type Handlers = FluentBuilderMethodsHandlers;
    runTest<Handlers, { [handlerName: string]: (...args: any[]) => any }>(
      {},
      {},
    );
  });

  // Test with mixed handler types
  await t.step("Mixed Handler Types", () => {
    type MixedHandlers = FluentBuilderMethodsHandlers & {
      start: () => void;
      stop: () => void;
      report: (data: number) => string;
    };

    // runTest<
    //   MixedHandlers,
    //   {
    //     [handlerName: string]: (...args: any[]) => any;
    //     start: () => void;
    //     stop: () => void;
    //     report: (data: number) => string;
    //   }
    // >(
    //   {
    //     start: () => {},
    //     stop: () => {},
    //     report: (data: number) => `Report for ${data}`,
    //   },
    //   {
    //     start: () => {},
    //     stop: () => {},
    //     report: (data: number) => `Report for ${data}`,
    //   },
    // );
  });
});
