const TWITCH_API_CLIENT_ID = process.env["TWITCH_API_CLIENT_ID"] ?? "";
const TWITCH_API_SECRET = process.env["TWITCH_API_SECRET"] ?? "";
const UI_FOLDER_PATH = "./static";

export default {
  TWITCH_API_CLIENT_ID,
  TWITCH_API_SECRET,
  UI_FOLDER_PATH,
};
