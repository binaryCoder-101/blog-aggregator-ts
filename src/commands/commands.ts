import { setUser } from "src/config.js";

type commandHandler = (cmdname: string, ...args: string[]) => Promise<void>;

export type commandsRegistry = {
  [key: string]: commandHandler;
};

export async function registerCommand(
  registry: commandsRegistry,
  cmdName: string,
  handler: commandHandler
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

