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
    include: { medicines: true },
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
const getSingleCategoriesById = async (id: string | undefined) => {
  return prisma.categories.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      medicines: true,
    },
  });
};

const updateCategory = async (id: string, data: any) => {
  const isExist = await prisma.categories.findFirstOrThrow({
    where: { id },
    select: { id: true, status: true },
  });

  if (data.status) {
    return prisma.categories.update({
      where: { id: isExist.id },
      data,
    });
  }
  return "Action can't perform.";
};

const deleteCategories = async (id: string | undefined) => {
  const isExist = await prisma.categories.findFirstOrThrow({
    where: { id },
    select: { id: true },
  });

  return prisma.categories.delete({
    where: { id: isExist.id },
  });
};

export const CategoriesService = {
  createCategories,
  getAllCategories,
  getSingleCategoriesById,
   updateCategory,
  deleteCategories,
};
