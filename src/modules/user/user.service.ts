import { Role, Status } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";

const getUser = async (user: RequestUser | undefined) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    include: {
      profile: true,
    },
  });
};

const updateUser = async (user: RequestUser | undefined, data: any) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
    },
  });

  if (data.role || data.emailVerified || data.status) {
    delete data.role;
    delete data.emailVerified;
    delete data.status;
  }
  return await prisma.user.update({
    where: {
      id: isExist.id,
    },
    data,
  });
};

const getAllUsers = async ({
  options,
  search,
  role,
  status,
}: {
  options: PgOptionsRs;
  search: string | undefined;
  role: string | undefined;
  status: string | undefined;
}) => {
  const { page, limit, skip, sortBy, sortOrder } = options;
  const conditions: UserWhereInput[] = [];

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
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (role) {
    conditions.push({
      role: role as Role,
    });
  }

  if (status) {
    conditions.push({
      status: status as Status,
    });
  }

  const result = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: conditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: conditions,
    },
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

const updateUserStatus = async (id: string | undefined, data: any) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { id: true },
  });

  return await prisma.user.update({
    where: {
      id: isExist.id,
    },
    data: {
      status: data?.status,
    },
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

export const UserService = {
  getUser,
  updateUser,
  getAllUsers,
  updateUserStatus,
  deleteUser
};
