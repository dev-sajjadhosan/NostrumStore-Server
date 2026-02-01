import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoriesService } from "./categories.service";
import { paginationHelpers } from "../../helpers/paginationHelpers";

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
  const { search } = req.query;
  const isSearch = typeof search === "string" ? search : undefined;
  const options = paginationHelpers(req.query);

  const { data, pagination } = await CategoriesService.getAllCategories({
    search: isSearch as string,
    options,
  });

  if (data.length <= 0) {
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      empty: true,
      data: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: { data, pagination },
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

const updateCategoryStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await CategoriesService.updateCategoryStatus(
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
  updateCategoryStatus,
  deleteCategories,
};
