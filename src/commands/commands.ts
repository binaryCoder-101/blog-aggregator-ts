import { User } from "src/lib/db/schema";

export type CommandHandler = (
  cmdname: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type commandsRegistry = {
  [key: string]: CommandHandler;
};

export async function registerCommand(
  registry: commandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): Promise<void> {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: commandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}
