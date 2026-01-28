import dotenv from "dotenv";
import path from "path";

dotenv.configDotenv({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  port: process.env.PORT,
  version: process.env.API_VERSION,
  app_url: process.env.APP_URL,
  better_secret: process.env.BETTER_AUTH_SECRET,
  better_url: process.env.BETTER_AUTH_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SEC,
  discord_client_id: process.env.DISCORD_CLIENT_ID,
  discord_client_secret: process.env.DISCORD_CLIENT_SEC,
  app_user: process.env.APP_USER,
  app_pass: process.env.APP_PASS,
};
