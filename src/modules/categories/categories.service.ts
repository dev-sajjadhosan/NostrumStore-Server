import { CategoriesWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";

const createCategories = async ({ data }: { data: any }) => {
  return prisma.categories.create({
    data,
  });
};
const getAllCategories = async ({
  search,
  options,
}: {
  search: string;
  options: PgOptionsRs;
}) => {
  const { page, limit: take, skip, sortBy, sortOrder } = options;
  const result = await prisma.categories.findMany({
    take,
    skip,
    where: {
      AND: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.categories.count({
    where: {
      AND: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    },
  });

  return {
    data: result,
    pagination: {
      page,
      pages: Math.ceil(total / take),
      limit: take,
      total,
    },
  };
};
// const getSingleCategories = async () => {};

export const CategoriesService = {
  createCategories,
    getAllCategories,
  //   getSingleCategories,
};
