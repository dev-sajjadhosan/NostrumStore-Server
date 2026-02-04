import { Router } from "express";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/review",
  protect,
  restrictRole("CUSTOMER"),
  ReviewController.createReview,
);

router.get(
  "/review/:id",
  protect,
  restrictRole("CUSTOMER"),
  ReviewController.getAllReviewByMedicineId,
);
router.post(
  "/review/order",
  protect,
  restrictRole("CUSTOMER"),
  ReviewController.createOrderReview,
);

router.get(
  "/review/order/:id",
  protect,
  restrictRole("CUSTOMER"),
  ReviewController.getAllOrderReviewByMedicineId,
);

export const ReviewRoutes = router;