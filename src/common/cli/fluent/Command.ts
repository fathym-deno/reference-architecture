import type { CommandParams } from "../commands/CommandParams.ts";
import { CommandModuleBuilder } from "./CommandModuleBuilder.ts";

export function Command<
  F extends Record<string, unknown> = Record<string, unknown>,
  A extends unknown[] = unknown[],
  P extends CommandParams<F, A> = CommandParams<F, A>,
>(
  name: string,
  description: string,
): CommandModuleBuilder<F, A, P, Record<string, unknown>> {
  return new CommandModuleBuilder<F, A, P, Record<string, unknown>>(
    name,
    description,
  );
}
