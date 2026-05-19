import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import env from "~/env";
import { getRssFeed } from "~/services/feedService";
import { getUserData } from "~/services/twitchService";
import { getStreamUrl } from "~/services/videoService";
import { Quality } from "~/types";

const router = new Hono();

const getQuality = (value: string | undefined) => parseInt(value ?? "") || Quality.Maximum;

router.get("/", serveStatic({ path: `${env.UI_FOLDER_PATH}/index.html` }));
router.get("/favicon.ico", serveStatic({ path: `${env.UI_FOLDER_PATH}/favicon.ico` }));
router.get("/robots.txt", serveStatic({ path: `${env.UI_FOLDER_PATH}/robots.txt` }));
router.get("/assets/*", serveStatic({ root: env.UI_FOLDER_PATH }));

router.get("/api/users/:username", async (context) => {
  try {
    const username = context.req.param("username");

    const userData = await getUserData(username);

    return context.json(userData);
  } catch (error) {
    const message = typeof error === "string" ? error : "Unexpected Error";
    return context.text(message, message.toLowerCase().includes("not found") ? 404 : 500);
  }
});

router.get("/:username/feed", async (context) => {
  try {
    const username = context.req.param("username");
    const host = context.req.header("host") ?? "";
    const quality = getQuality(context.req.query("quality"));

    const rssFeed = await getRssFeed(username, host, quality);

    return context.body(rssFeed, 200, {
      "Cache-Control": "s-maxage=900",
      "Content-Type": "application/rss+xml; charset=utf-8",
    });
  } catch (error) {
    const message = typeof error === "string" ? error : "Unexpected Error";
    if (message.toLowerCase().includes("not found")) return context.text(message, 404);
    console.error(error);
    return context.text(message, 500);
  }
});

router.get("/videos/:videoId", async (context) => {
  try {
    const videoId = context.req.param("videoId");
    const quality = getQuality(context.req.query("quality"));

    const streamUrl = await getStreamUrl(videoId, quality);

    return context.redirect(streamUrl);
  } catch (error) {
    return context.text(typeof error === "string" ? error : "Unexpected Error", 500);
  }
});

router.get("/*", serveStatic({ path: `${env.UI_FOLDER_PATH}/index.html` }));

export default router;
