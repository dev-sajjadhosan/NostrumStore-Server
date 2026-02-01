import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.get("/profile/me", protect, UserController.getUser);
router.patch("/profile/me", protect, UserController.updateUser);
router.patch("/profile/role/:id", protect, UserController.updateUserRole);

router.get(
  "/admin/users",
  protect,
  restrictRole("ADMIN"),
  UserController.getAllUsers,
);

router.patch(
  "/admin/users/:id",
  protect,
  restrictRole("ADMIN"),
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
  restrictRole("ADMIN"),
  UserController.deleteUser,
);

export const UserRoutes = router;
