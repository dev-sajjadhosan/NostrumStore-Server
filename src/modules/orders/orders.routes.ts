import { Router } from "express";
import { OrderController } from "./orders.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.post(
  "/orders",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.createOrder,
);

router.get(
  "/orders",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.getAllUserOrders,
);

router.get(
  "/orders/:id",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.getOrderById,
);

router.get(
  "/seller/orders",
  protect,
  restrictRole("SELLER"),
  OrderController.getAllOrders,
);

router.patch(
  "/seller/orders/:id",
  protect,
  restrictRole("SELLER"),
  OrderController.updateOrderStatus,
);

export const OrdersRoutes = router;
