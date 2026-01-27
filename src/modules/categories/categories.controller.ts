import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoriesService } from "./categories.service";

const createCategories = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await CategoriesService.createCategories({data});

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: result,
  });
});

export const CategoriesController = {createCategories};
