import { readConfig } from "src/config";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerAddFeedFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const currentUserName = readConfig().currentUserName;

  const currentUserDetails = await getUserByName(currentUserName);
  if (!currentUserDetails) {
    throw new Error(`User ${currentUserName} not found`);
  }

  const url = args[0];
  const feedDetails = await getFeedByURL(url);
  if (!feedDetails) {
    throw new Error(`Feed not found: ${url}`);
  }

  const result = await createFeedFollow(currentUserDetails.id, feedDetails.id);

  printFeedFollow(result.userName, result.feedName);
}

export async function handlerGetFeedFollowsForUser(
  cmdName: string,
  ...args: string[]
) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const currentUserName = readConfig().currentUserName;

  const currentUserDetails = await getUserByName(currentUserName);
  if (!currentUserDetails) {
    throw new Error(`User ${currentUserName} not found`);
  }

  const result = await getFeedFollowsForUser(currentUserDetails.id);
  if (result.length === 0) {
    console.log(`No feed follows found for this user.`);
    return;
  }

  console.log(`Feeds folowed by ${currentUserName}: `);
  for (let feedFollow of result) {
    console.log(`${feedFollow.feedName}`);
  }
}

export async function printFeedFollow(userName: string, feedName: string) {
  console.log(`Feed follow created: `);
  console.log(`Current User: ${userName}`);
  console.log(`Feed Name: ${feedName}`);
}