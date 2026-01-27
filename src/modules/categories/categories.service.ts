import { CategoriesWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { prisma } from "../../lib/prisma";

const createCategories = async ({ data }: { data: any }) => {
  return prisma.categories.create({
    data,
  });
};
// const getAllCategories = async () => {};
// const getSingleCategories = async () => {};

export const CategoriesService = {
  createCategories,
  //   getAllCategories,
  //   getSingleCategories,
};
