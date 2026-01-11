import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUserByName, getUserByID } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

    const loggedUser = readConfig().currentUserName;
    const userFields = await getUserByName(loggedUser);

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

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
      throw new Error(`usage: ${cmdName}`);
    }

    const feedsList = await getFeeds();

    for (const feed of feedsList) {

        const createdBy = await getUserByID(feed.user_id);

        console.log(`* Feed Name: ${feed.name}`);
        console.log(`* Feed URL: ${feed.url}`);
        console.log(`* Feed created by: ${createdBy.name}\n`);
    }
}