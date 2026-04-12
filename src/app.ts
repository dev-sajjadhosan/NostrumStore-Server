import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./modules/user/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundRoutes } from "./middleware/routeNotFound";
import { MedicinesRoutes } from "./modules/medicines/medicines.routes";
import { CategoriesRouter } from "./modules/categories/categories.routes";
import { OrdersRoutes } from "./modules/orders/orders.routes";
import { ReviewRoutes } from "./modules/review/review.routes";
import { AuthRoutes } from "./modules/auth/auth.routes";
import path from "path";
import { seedAdmin } from "./script/seedAdmin";
import { seedManager } from "./script/seedManager";
import { seedSuperAdmin } from "./script/seedSuperAdmin";
import { seedSeller } from "./script/seedSeller";
const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nostrum-store.vercel.app",
      "https://nostrum-store-server.vercel.app",
      config.app_url as string,
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Nostrum Store API Gateway",
    data: {
      name: "Nostrum Store",
      version: config.version || "v1",
      status: "healthy",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
});

app.get("/seed", async (req: Request, res: Response) => {
  await seedSuperAdmin();
  await seedAdmin();
  await seedManager();
  await seedSeller();

  res.status(200).json({
    success: true,
    message: "Database seeded successfully",
  });
});

app.use("/api", UserRoutes);
app.use("/api", MedicinesRoutes);
app.use("/api/categories", CategoriesRouter);
app.use("/api", OrdersRoutes);
app.use("/api", ReviewRoutes);
app.use("/api/auths", AuthRoutes);

app.use(errorHandler);
app.use(notFoundRoutes);

export default app;
