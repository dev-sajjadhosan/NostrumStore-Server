import {
  MedicinesUpdateInput,
  MedicinesWhereInput,
} from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";

const getAllMedicines = async ({
  search,
  tags,
  options,
}: {
  search: string | undefined;
  tags: string[] | [];
  options: PgOptionsRs;
}) => {
  const { limit: take, page, skip, sortBy, sortOrder } = options;
  const conditions: MedicinesWhereInput[] = [];

  if (search) {
    conditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          group: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    conditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  const result = await prisma.medicines.findMany({
    take,
    skip,
    where: {
      AND: conditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.medicines.count({
    where: {
      AND: conditions,
    },
  });

  return {
    data: result,
    pagination: {
      search,
      page,
      limit: take,
      total,
      pages: Math.ceil(total / take),
    },
  };
};

const getSingleMedicineById = async (id: string) => {
  return prisma.medicines.findUniqueOrThrow({
    where: { id },
  });
};

const createMedicine = async ({
  user,
  data,
}: {
  user: RequestUser | undefined;
  data: any;
}) => {
  return prisma.medicines.create({
    data: {
      ...data,
      sellerId: user?.id,
    },
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
};
