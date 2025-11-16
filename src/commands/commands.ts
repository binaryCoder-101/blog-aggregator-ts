import { setUser } from "src/config.js";

type commandHandler = (cmdname: string, ...args: string[]) => void;

export type commandsRegistry = {
  [key: string]: commandHandler;
};

export function registerCommand(
  registry: commandsRegistry,
  cmdName: string,
  handler: commandHandler
): void {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: commandsRegistry,
  cmdName: string,
  ...args: string[]
): void {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  handler(cmdName, ...args);
}
