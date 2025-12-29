import { fetchFeed } from "src/lib/rss";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  //   if (args.length !== 1) {
  //   throw new Error(`usage: ${cmdName} <name>`);
  // }

  const feedURL = "https://www.wagslane.dev/index.xml";

  const resultObject = await fetchFeed(feedURL);
  if (!resultObject){
    throw new Error("Feed not available!");
  }

  console.log(JSON.stringify(resultObject));
}