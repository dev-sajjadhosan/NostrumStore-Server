import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.get("/profile/me", protect, UserController.getUser);
router.patch("/profile/me", protect, UserController.updateUser);

router.patch(
  "/profile/role/:id",
  protect,
  restrictRole("SUPER_ADMIN", "CUSTOMER", "ADMIN", "SELLER"),
  UserController.updateUserRole,
);

router.get("/profile", protect, UserController.getProfile);
router.patch(
  "/profile/update",
  protect,
  restrictRole("CUSTOMER", "ADMIN", "SELLER", "SUPER_ADMIN", "MANAGER"),
  UserController.updateProfile,
);

router.get(
  "/admin/users",
  protect,
  restrictRole("ADMIN", "SUPER_ADMIN", "MANAGER"),
  UserController.getAllUsers,
);

router.get(
  "/admin/metadata",
  protect,
  restrictRole("ADMIN", "SUPER_ADMIN", "MANAGER"),
  UserController.adminMetaData,
);

router.get(
  "/seller/metadata",
  protect,
  restrictRole("SELLER"),
  UserController.sellerMetaData,
);

router.patch(
  "/admin/users/:id",
  protect,
  restrictRole("ADMIN", "SUPER_ADMIN"),
  UserController.updateUserStatus,
);

router.delete(
  "/profile/me",
  protect,
  restrictRole("CUSTOMER"),
  UserController.deleteUser,
);

router.delete(
  "/admin/users/:id",
  protect,
  restrictRole("ADMIN", "SUPER_ADMIN"),
  UserController.deleteUser,
);

export const UserRoutes = router;
