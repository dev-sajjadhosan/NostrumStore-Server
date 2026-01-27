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
};
