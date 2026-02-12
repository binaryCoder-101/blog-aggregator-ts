import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

// this one
export async function handlerAddFeedFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  const feedDetails = await getFeedByURL(url);
  if (!feedDetails) {
    throw new Error(`Feed not found: ${url}`);
  }

  const result = await createFeedFollow(user.id, feedDetails.id);

  printFeedFollow(result.userName, result.feedName);
}

// aaand this one
export async function handlerGetFeedFollowsForUser(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const result = await getFeedFollowsForUser(user.id);
  if (result.length === 0) {
    console.log(`No feed follows found for this user.`);
    return;
  }

  console.log(`Feeds folowed by ${user.name}: `);
  for (let feedFollow of result) {
    console.log(`${feedFollow.feedName}`);
  }
}

export async function printFeedFollow(userName: string, feedName: string) {
  console.log(`Feed follow created: `);
  console.log(`Current User: ${userName}`);
  console.log(`Feed Name: ${feedName}`);
}
