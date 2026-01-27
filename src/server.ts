import app from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    app.listen(port, () => {
      console.log(`The Server is running on Port: [${port}]`);
      console.log(`Url: http://localhost:${port}`);
    });
  } catch (err) {
    console.log("An error occurred: ", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
