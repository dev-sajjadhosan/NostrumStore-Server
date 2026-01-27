import { RequestUser } from "../../@types/express";
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

export const UserService = { getUser, updateUser };
