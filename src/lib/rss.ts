import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    method: "GET",
    headers: {
      "User-Agent": "gator",
    },
  });
  if (!response.ok) {
    throw new Error(`failed to fetch feed: ${response.status} ${res.statusText}`);
  }

  const xml = await response.text();
  const parser = new XMLParser();
  let result = parser.parse(xml);

  const channel = result.rss?.channel;
  if (!channel) {
    throw new Error("Failed to parse channel");
  }
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("Missing channel metadata");
  }

  let resultObject: RSSFeed = {
    channel: {
      title: "",
      link: "",
      description: "",
      item: [],
    },
  };

  resultObject.channel.title = channel.title;
  resultObject.channel.link = channel.link;
  resultObject.channel.description = channel.description;

  if (channel.item && Array.isArray(channel.item)) {
    for (const item of channel.item) {
      if (!item.title || !item.link || !item.description || !item.pubDate) {
        continue;
      }

      const title = item.title;
      const link = item.link;
      const description = item.description;
      const pubDate = item.pubDate;

      const itemObj = {
        title,
        link,
        description,
        pubDate,
      };

      resultObject.channel.item.push(itemObj);
    }
  }

  return resultObject;
}
