import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../middleware/protect";

const router = Router();

router.get("/", protect, UserController.getUser);
router.patch("/", protect, UserController.updateUser);

export const UserRoutes = router;
