import { readConfig } from "src/config";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUserByName, getUserByID } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { printFeedFollow } from "./feed_follows";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name>`);
  }

  const loggedUserName = readConfig().currentUserName;
  const userFields = await getUserByName(loggedUserName);

  if (!userFields) {
    throw new Error(`User ${loggedUserName} not found`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, userFields.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  const feedFollow = await createFeedFollow(userFields.id, feed.id);

  printFeedFollow(feedFollow.userName, feedFollow.feedName);

  console.log("Feed created successfully:");
  printFeed(feed, userFields);
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

  const feeds = await getFeeds();

  if (feeds.length === 0) {
    console.log();
  }

  for (const feed of feeds) {
    const user = await getUserByID(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }

    printFeed(feed, user);
  }
}
