import { Router } from "express";
import { CategoriesController } from "./categories.controller";

const router = Router();

router.get("/", CategoriesController.getAllCategories); // Public
router.post("/", CategoriesController.createCategories); // Admin

export const CategoriesRouter = router;
