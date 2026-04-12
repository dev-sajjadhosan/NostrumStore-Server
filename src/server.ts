import app from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";


async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    app.listen(5000, () => {
      console.log(`The Server is running on Port: [5000]`);
      console.log(`Url: http://localhost:5000`);
    });
  } catch (err) {
    console.log("An error occurred: ", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
