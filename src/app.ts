import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { UserRoutes } from "./modules/user/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundRoutes } from "./middleware/routeNotFound";
import { MedicinesRoutes } from "./modules/medicines/medicines.routes";
import { CategoriesRouter } from "./modules/categories/categories.routes";
import { OrdersRoutes } from "./modules/orders/orders.routes";
import { ReviewRoutes } from "./modules/review/review.routes";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", config.app_url as string],
    credentials: true,
  }),
);
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


app.use("/api", UserRoutes);
app.use("/api", MedicinesRoutes);
app.use("/api/categories", CategoriesRouter);
app.use("/api", OrdersRoutes);
app.use("/api", ReviewRoutes);

app.use(errorHandler);
app.use(notFoundRoutes);

export default app;
