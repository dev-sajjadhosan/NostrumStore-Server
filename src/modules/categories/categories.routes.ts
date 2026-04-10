import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.get("/", CategoriesController.getAllCategories); // Public
router.get("/:id", CategoriesController.getSingleCategoriesById); // Public
router.post(
  "/",
    protect,
    restrictRole("ADMIN", "SUPER_ADMIN"),
  CategoriesController.createCategories,
); // Admin

router.put(
  "/:id",
    protect,
    restrictRole("ADMIN", "SUPER_ADMIN"),
  CategoriesController.updateCategory,
);

router.delete(
  "/:id",
  protect,
  restrictRole("ADMIN", "SUPER_ADMIN"),
  CategoriesController.deleteCategories,
);
export const CategoriesRouter = router;
