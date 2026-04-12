import { Prisma, Reviews, OrderReview } from "../../../generated/prisma/client";
import { ReviewsWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilders";
import {
  reviewsSearchableFields,
  reviewsFilterableFields,
  reviewsIncludeConfig,
  orderReviewSearchableFields,
  orderReviewFilterableFields,
  orderReviewIncludeConfig,
} from "../../config/query.config";
import { IQueryParams, IQueryResult } from "../../interface/query.interface";

const createOrderReview = async ({
  user,
  data,
}: {
  user: RequestUser | undefined;
  data: any;
}) => {
  return await prisma.orderReview.create({
    data: {
      userId: user?.id,
      ...data,
    },
  });
};

const getAllOrderReviewByMedicineId = async (
  query: IQueryParams,
  id: string,
): Promise<IQueryResult<OrderReview>> => {
  const queryBuilder = new QueryBuilder<
    OrderReview,
    Prisma.OrderReviewWhereInput,
    Prisma.OrderReviewInclude
  >(prisma.orderReview, query, {
    searchableFields: orderReviewSearchableFields,
    filterableFields: orderReviewFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ orderId: id })
    .dynamicInclude(orderReviewIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};
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

const getAllReviewByMedicineId = async (
  query: IQueryParams,
  id: string,
): Promise<IQueryResult<Reviews>> => {
  const queryBuilder = new QueryBuilder<
    Reviews,
    Prisma.ReviewsWhereInput,
    Prisma.ReviewsInclude
  >(prisma.reviews, query, {
    searchableFields: reviewsSearchableFields,
    filterableFields: reviewsFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ medicineId: id })
    .dynamicInclude(reviewsIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};
export const ReviewService = {
  createReview,
  getAllReviewByMedicineId,
  createOrderReview,
  getAllOrderReviewByMedicineId,
};
