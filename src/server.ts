import express from "express";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {
  res.json({
    Name: "Nostrum Store",
    Message:
      "Welcome to the Nostrum Store Server. This is just an basic path to see this server working or not. So, We Wish be safe and healthy.",
    Database: "Local Storage",
    Database_Connection: false,
    Running: true,
    Authenticated: false,
    Mode: "Development",
    Version: "/api/v1",
    Created: "01/27/2026",
  });
});

app.listen(5000, () => {
  console.log("*_*".repeat(30));
  console.log(`The Server is running on PORT: {${5000}} &&`);
  console.log(`The Server is Url: http://localhost:${5000}`);
  console.log("*_*".repeat(30));
});
