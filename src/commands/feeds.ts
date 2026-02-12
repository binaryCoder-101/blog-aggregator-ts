import { readConfig } from "src/config";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUserByName, getUserByID } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { printFeedFollow } from "./feed_follows";

// this one
export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  printFeedFollow(feedFollow.userName, feedFollow.feedName);

  console.log("Feed created successfully:");
  printFeed(feed, user);
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
    console.log(`No feeds found.`);
    return;
  }

  for (const feed of feeds) {
    const user = await getUserByID(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }

    printFeed(feed, user);
  }
}
