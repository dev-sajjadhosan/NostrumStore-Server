import { Router } from "express";
import { OrderController } from "./orders.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.post(
  "/",
  protect,
//   restrictRole("ADMIN", "SELLER"),
  OrderController.createOrder,
);

export const OrdersRoutes = router;
