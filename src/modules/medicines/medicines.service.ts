import { MedicinesWhereInput } from "../../../generated/prisma/models";
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



export const MedicinesService = { getAllMedicines };
