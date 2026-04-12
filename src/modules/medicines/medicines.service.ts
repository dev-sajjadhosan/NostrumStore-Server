import { Prisma, Medicines } from "../../../generated/prisma/client";
import {
  MedicinesUpdateInput,
  MedicinesWhereInput,
} from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilders";
import {
  medicinesSearchableFields,
  medicinesFilterableFields,
  medicinesIncludeConfig,
} from "../../config/query.config";
import { IQueryParams, IQueryResult } from "../../interface/query.interface";


const getSellerAllMedicines = async (
  query: IQueryParams,
  userId: string,
): Promise<IQueryResult<Medicines>> => {
  const queryBuilder = new QueryBuilder<
    Medicines,
    Prisma.MedicinesWhereInput,
    Prisma.MedicinesInclude
  >(prisma.medicines, query, {
    searchableFields: medicinesSearchableFields,
    filterableFields: medicinesFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ sellerId: userId })
    .dynamicInclude(medicinesIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getAllMedicines = async (
  query: IQueryParams,
): Promise<IQueryResult<Medicines>> => {
  const queryBuilder = new QueryBuilder<
    Medicines,
    Prisma.MedicinesWhereInput,
    Prisma.MedicinesInclude
  >(prisma.medicines, query, {
    searchableFields: medicinesSearchableFields,
    filterableFields: medicinesFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .dynamicInclude(medicinesIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getSingleMedicineById = async (id: string) => {
  await prisma.medicines.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });
  return prisma.medicines.findUniqueOrThrow({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
};

const createMedicine = async ({
  user,
  data,
}: {
  user: RequestUser | undefined;
  data: any;
}) => {
  const formattedData = {
    ...data,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,

    image: data.image || "default-placeholder.png",
    sellerId: user?.id,
  };
  return await prisma.medicines.create({
    data: formattedData,
  });
};

const updateMedicine = async ({
  id,
  user,
  data,
}: {
  id: any;
  user: RequestUser | undefined;
  data: MedicinesUpdateInput;
}) => {
  const isExist = await prisma.medicines.findUnique({
    where: { id },
    select: { id: true },
  });

  return await prisma.medicines.update({
    where: { id: isExist?.id, sellerId: user?.id },
    data,
  });
};
const updateMedicineStock = async ({
  id,
  user,
  data,
}: {
  id: any;
  user: RequestUser | undefined;
  data: { stock: number };
}) => {
  const isExist = await prisma.medicines.findUnique({
    where: { id },
    select: { id: true, stock: true },
  });

  if (!isExist) throw new Error("Medicine not found or unauthorized");

  if (data?.stock < 0) {
    return { error: "Stock cannot be negative" };
  }

  return await prisma.medicines.update({
    where: { id: isExist?.id, sellerId: user?.id },
    data: {
      stock: {
        increment: data?.stock,
      },
    },
  });
};

const deleteMedicine = async (id: string) => {
  return await prisma.medicines.delete({
    where: { id },
  });
};

export const MedicinesService = {
  getAllMedicines,
  getSingleMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getSellerAllMedicines,
  updateMedicineStock,
};
