import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.post(
  "/change-password",
  protect,
  restrictRole("CUSTOMER", "ADMIN", "SELLER", "SUPER_ADMIN", "MANAGER"),
  AuthController.changePassword,
);
router.post(
  "/logout",
  protect,
  restrictRole("CUSTOMER", "ADMIN", "SELLER", "SUPER_ADMIN", "MANAGER"),
  AuthController.logoutUser,
);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);

router.post("/send-verify-otp", protect, AuthController.sendVerifyOtp);

export const AuthRoutes = router;
