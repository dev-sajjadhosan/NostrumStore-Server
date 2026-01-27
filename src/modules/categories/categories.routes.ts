import { Router } from "express";
import { CategoriesController } from "./categories.controller";

const router = Router();

router.post("/", CategoriesController.createCategories);

export const CategoriesRouter = router;
