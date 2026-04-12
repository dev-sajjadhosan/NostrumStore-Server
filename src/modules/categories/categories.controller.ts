import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoriesService } from "./categories.service";
import { IQueryParams } from "../../interface/query.interface";

const createCategories = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CategoriesService.createCategories({ data });

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const query: IQueryParams = {
    searchTerm: req.query.searchTerm as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    fields: req.query.fields as string,
    includes: req.query.includes as string,
  };

  const { data, meta } = await CategoriesService.getAllCategories(query);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: { data, meta },
  });
});

const getSingleCategoriesById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CategoriesService.getSingleCategoriesById(
      id as string,
    );

    res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: result,
    });
  },
);

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await CategoriesService.updateCategory(
    id as string,
    data,
  );

  res.status(201).json({
    success: true,
    message: "Category status change.",
    data: result,
  });
});

const deleteCategories = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CategoriesService.deleteCategories(id as string);
  res.status(200).json({
    success: true,
    message: "Category delete successfully.",
    data: result,
  });
});

export const CategoriesController = {
  createCategories,
  getAllCategories,
  getSingleCategoriesById,
  updateCategory,
  deleteCategories,
};
