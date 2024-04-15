import "server-only";
import { Podcast } from "podcast";
import { Quality } from "~/types";
import { getUserData, getVideos } from "./twitchService";

const getRssFeed = async (username: string, hostname: string, quality: Quality) => {
  const user = await getUserData(username);
  const videos = await getVideos(user.id);

  const rssFeed = new Podcast({
    title: user.displayName,
    description: user.description,
    author: user.displayName,
    feedUrl: `http://${hostname}/${username}/feed${
      quality != Quality.Maximum ? `?quality=${quality}` : ""
    }`,
    siteUrl: user.url,
    imageUrl: user.profileImageUrl,
  });

  videos.forEach((video) =>
    rssFeed.addItem({
      title: video.title,
      itunesTitle: video.title,
      description: video.url,
      date: new Date(video.date),
      enclosure: {
        url: `http://${hostname}/videos/${video.id}${
          quality != Quality.Maximum ? `?quality=${quality}` : ""
        }`,
        type: quality === Quality.Audio ? "audio/aac" : "video/mp4",
      },
      url: video.url,
      itunesDuration: video.duration,
    }),
  );

  return rssFeed.buildXml();
};

export { getRssFeed };
