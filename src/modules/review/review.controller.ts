import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { IQueryParams } from "../../interface/query.interface";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;

  const result = await ReviewService.createReview({ user, data });

  res.status(201).json({
    success: true,
    message: "Review placed successfully!",
    data: result,
  });
});

const getAllOrderReviewByMedicineId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const query: IQueryParams = {
      searchTerm: req.query.searchTerm as string,
      page: req.query.page as string,
      limit: req.query.limit as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      fields: req.query.fields as string,
      includes: req.query.includes as string,
    };

    const result = await ReviewService.getAllOrderReviewByMedicineId(query, id);

    res.status(200).json({
      success: true,
      message: "Order Review fetched successfully!",
      data: result,
    });
  },
);

const createOrderReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;

  const result = await ReviewService.createOrderReview({ user, data });

  res.status(201).json({
    success: true,
    message: "Order Review placed successfully!",
    data: result,
  });
});

const getAllReviewByMedicineId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const query: IQueryParams = {
      searchTerm: req.query.searchTerm as string,
      page: req.query.page as string,
      limit: req.query.limit as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      fields: req.query.fields as string,
      includes: req.query.includes as string,
    };

    const result = await ReviewService.getAllReviewByMedicineId(query, id);

    res.status(200).json({
      success: true,
      message: "Review fetched successfully!",
      data: result,
    });
  },
);

export const ReviewController = {
  createReview,
  getAllReviewByMedicineId,
  getAllOrderReviewByMedicineId,
  createOrderReview,
};
