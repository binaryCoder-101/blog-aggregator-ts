import { readConfig } from "src/config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

    const loggedUser = readConfig().currentUserName;
    const userFields = await getUser(loggedUser);

    if (!userFields) {
      throw new Error(`User not found`);
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, userFields.id);
    if(!feed) {
      throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully:");
    printFeed(feed, userFields)
}

function printFeed(feed: Feed, user: User) {
    console.log(`ID: ${feed.id}`);
    console.log(`Created: ${feed.createdAt}`);
    console.log(`Updated: ${feed.updatedAt}`);
    console.log(`Feed Name: ${feed.name}`);
    console.log(`Feed URL: ${feed.url}`);
    console.log(`User Name: ${user.name}`);
}