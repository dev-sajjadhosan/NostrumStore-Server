import { ReviewsWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";

const createReview = async ({
  user,
  data,
}: {
  user: RequestUser | undefined;
  data: any;
}) => {
  return await prisma.reviews.create({
    data: {
      userId: user?.id,
      ...data,
    },
  });
};

const getAllReviewByMedicineId = async ({
  user,
  options,
  id,
}: {
  user: RequestUser | undefined;
  options: PgOptionsRs;
  id: string;
}) => {
  const { page, skip, limit, sortBy, sortOrder } = options;

  const result = await prisma.reviews.findMany({
    skip,
    take: limit,
    where: { medicineId: id },

    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.reviews.count({
    where: { medicineId: id },
  });

  return {
    data: result,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
      total,
    },
  };
};

export const ReviewService = {
  createReview,
  getAllReviewByMedicineId,
};
