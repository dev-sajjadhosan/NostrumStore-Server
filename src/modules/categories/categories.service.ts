import { Prisma, Categories } from "../../../generated/prisma/client";
import { CategoriesWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilders";
import {
  categoriesSearchableFields,
  categoriesFilterableFields,
  categoriesIncludeConfig,
} from "../../config/query.config";
import { IQueryParams, IQueryResult } from "../../interface/query.interface";


const createCategories = async ({ data }: { data: any }) => {
  return prisma.categories.create({
    data,
  });
};

const getAllCategories = async (
  query: IQueryParams,
): Promise<IQueryResult<Categories>> => {
  const queryBuilder = new QueryBuilder<
    Categories,
    Prisma.CategoriesWhereInput,
    Prisma.CategoriesInclude
  >(prisma.categories, query, {
    searchableFields: categoriesSearchableFields,
    filterableFields: categoriesFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .dynamicInclude(categoriesIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
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
