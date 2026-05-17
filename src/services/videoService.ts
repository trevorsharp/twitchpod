import "server-only";
import { Quality } from "~/types";
import { getVodPlaylist } from "./m3u8Service";

const getStreamUrl = async (videoId: string, quality: Quality) => {
  const [, playlistData] = await getVodPlaylist(videoId);
  const streamUrl = getPlaylistUrl(playlistData, quality);

  if (streamUrl === "") throw `Video not found with id ${videoId}`;

  return streamUrl;
};

const getPlaylistUrl = (playlistData: { quality?: string; url?: string }[], quality: Quality) => {
  switch (quality) {
    case Quality.P720:
      return (
        playlistData.find((x) => x.quality?.startsWith("720p"))?.url ?? playlistData[0]?.url ?? ""
      );
    case Quality.P480:
      return playlistData.find((x) => x.quality === "480p")?.url ?? playlistData[0]?.url ?? "";
    case Quality.Audio:
      return (
        playlistData.find((x) => x.quality === "Audio Only")?.url ?? playlistData[0]?.url ?? ""
      );
    default:
      return playlistData[0]?.url ?? "";
  }
};

export { getStreamUrl };
