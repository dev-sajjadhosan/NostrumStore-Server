import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { paginationHelpers } from "../../helpers/paginationHelpers";


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

const getAllReviewByMedicineId = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { id } = req.params;

  const options = paginationHelpers(req.query);

  const result = await ReviewService.getAllReviewByMedicineId({
    user,
    options,
    id,
  } as any);

  res.status(200).json({
    success: true,
    message: "Review fetched successfully!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviewByMedicineId,
};
