import { readConfig, setUser } from "./config.js";
import {
  commandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { handlerLogin } from "./commands/users.js";
import { exit } from "process";

function main() {
  // console.log("login misaque");
  // setUser("Misaque");
  // const result = readConfig();
  // console.log(result);
  // const username = "Misaque";
  const registry: commandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);

  const prompt = process.argv.slice(2);
  const commandName = prompt[0];
  const commandArgs = prompt.slice(1);

  try {
    runCommand(registry, commandName, ...commandArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command: ${err.message}`);
    } else {
      console.error(`Error running command: ${err}`);
    }
    process.exit(1);
  }
}

main();
