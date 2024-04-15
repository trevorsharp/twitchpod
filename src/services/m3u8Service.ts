// Sourced from https://github.com/dudik/twitch-m3u8

import "server-only";

type AccessToken = { value: string; signature: string };

const clientId = "kimne78kx3ncx6brgo4mv6wki5h1ko";

const getAccessToken = (videoId: string, isVod: boolean) => {
  const data = JSON.stringify({
    operationName: "PlaybackAccessToken",
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712",
      },
    },
    variables: {
      isLive: !isVod,
      login: isVod ? "" : videoId,
      isVod,
      vodID: isVod ? videoId : "",
      playerType: "embed",
    },
  });

  return fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: { "Client-id": clientId },
    body: data,
    next: { revalidate: 5 * 60 },
  })
    .then(
      (response) =>
        response.json() as Promise<{
          data?: {
            videoPlaybackAccessToken?: AccessToken;
            streamPlaybackAccessToken?: AccessToken;
          };
        }>,
    )
    .then((data) =>
      isVod ? data?.data?.videoPlaybackAccessToken : data?.data?.streamPlaybackAccessToken,
    )
    .then((accessToken) => {
      if (!accessToken) throw "Could not get Twitch access token";
      return accessToken;
    })
    .catch(() => {
      throw "Could not get Twitch access token";
    });
};

const getPlaylist = (videoId: string, accessToken: AccessToken, isVod: boolean) => {
  return fetch(
    `https://usher.ttvnw.net/${
      isVod ? "vod" : "api/channel/hls"
    }/${videoId}.m3u8?client_id=${clientId}&token=${accessToken.value}&sig=${
      accessToken.signature
    }&allow_source=true&allow_audio_only=true`,
    { next: { revalidate: 5 * 60 } },
  )
    .then((response) => response.text())
    .catch(() => {
      throw "Could not get Twitch m3u8 playlist";
    });
};

const parsePlaylist = (playlist: string) => {
  const parsedPlaylist = [];
  const lines = playlist.split("\n");
  for (let i = 4; i < lines.length; i += 3) {
    parsedPlaylist.push({
      quality: lines[i - 2]?.split('NAME="')?.[1]?.split('"')[0],
      resolution:
        lines[i - 1]?.indexOf("RESOLUTION") !== -1
          ? lines[i - 1]?.split("RESOLUTION=")?.[1]?.split(",")?.[0]
          : null,
      url: lines[i],
    });
  }
  return parsedPlaylist;
};

const getVodPlaylist = async (videoId: string) => {
  const accessToken = await getAccessToken(videoId, true);
  const playlist = await getPlaylist(videoId, accessToken, true);
  const parsedPlaylist = parsePlaylist(playlist);
  return [playlist, parsedPlaylist] as const;
};

export { getVodPlaylist };
