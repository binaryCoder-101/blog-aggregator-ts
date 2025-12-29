import { readConfig, setUser } from "src/config.js";
import { createUser, deleteUsers, getUsers } from "src/lib/db/queries/users";
import { getUser } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const user = args[0];

  const userDetails = await getUser(user);
  if (!userDetails) {
    throw new Error(`User Doesn't exist!`);
  }

  setUser(user);
  console.log("User logged in successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0];

  if(await getUser(name)) {
    throw new Error(`user already exist!`);
  }

  const user = await createUser(name);
  
  setUser(user.name);

  console.log("User created successfully!");
  console.log(user);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length > 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  await deleteUsers();
  console.log("Database cleared successfully!");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  if (args.length > 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const usersList = await getUsers();

  for (const user of usersList) {
    const registeredUser = user.name;
    const loggedUser = readConfig().currentUserName;
    console.log(`* ${registeredUser} ${registeredUser === loggedUser ? "(current)" : ""}`);
  }
}