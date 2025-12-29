import { readConfig, setUser } from "./config.js";
import {
  commandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js";
import { exit } from "process";
import { handlerAggregate } from "./commands/aggregate.js";

async function main() {
  // console.log("login misaque");
  // setUser("Misaque");
  // const result = readConfig();
  // console.log(result);
  // const username = "Misaque";
  const registry: commandsRegistry = {};

  await registerCommand(registry, "login", handlerLogin);
  await registerCommand(registry, "register", handlerRegister);
  await registerCommand(registry, "reset", handlerReset);
  await registerCommand(registry, "users", handlerUsers);
  await registerCommand(registry, "agg", handlerAggregate)

  const prompt = process.argv.slice(2);
  const commandName = prompt[0];
  const commandArgs = prompt.slice(1);

  try {
    await runCommand(registry, commandName, ...commandArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command: ${err.message}`);
    } else {
      console.error(`Error running command: ${err}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
