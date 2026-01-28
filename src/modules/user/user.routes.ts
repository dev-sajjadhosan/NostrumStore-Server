import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.get("/profile/me", protect, UserController.getUser);
router.patch("/profile/me", protect, UserController.updateUser);

router.get(
  "/admin/users",
  protect,
  //   restrictRole("ADMIN"),
  UserController.getAllUsers,
);

router.patch(
  "/admin/users/:id",
  protect,
//   restrictRole("ADMIN"),
  UserController.updateUserStatus,
);

export const UserRoutes = router;
