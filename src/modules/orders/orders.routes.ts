import { Router } from "express";
import { OrderController } from "./orders.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.post(
  // Customer
  "/orders",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.createOrder,
);

router.get(
  "/seller/orders",
  protect,
  //   restrictRole('SELLER'),
  OrderController.getAllOrders,
); // Seller

router.patch(
  "/seller/orders/:id",
  protect,
  // restrictRole("SELLER"),
  OrderController.updateOrderStatus,
); // update orders status

export const OrdersRoutes = router;
