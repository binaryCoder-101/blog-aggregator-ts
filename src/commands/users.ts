import { setUser } from "src/config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const user = args[0];
  setUser(user);
  console.log("User was set successfully!");
}
