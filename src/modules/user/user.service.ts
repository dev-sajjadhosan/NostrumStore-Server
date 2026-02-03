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

const getProfile = async (user: RequestUser | undefined) => {
  return await prisma.profile.findUniqueOrThrow({
    where: {
      userId: user?.id,
    },
    include: {
      user: true,
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
  user,
  role,
  status,
}: {
  options: PgOptionsRs;
  search: string | undefined;
  user: any;

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
    data: result.filter((r) => r.id !== user?.id),
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

const updateUserRole = async (id: string | undefined, data: any) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (isExist.role === data?.role) {
    return isExist;
  }

  return await prisma.user.update({
    where: {
      id: isExist.id,
    },
    data: {
      role: data.role,
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

const sellerMetaData = async (id: string) => {
  const totalOrders = await prisma.orders.count({
    where: {
      items: {
        some: {
          medicine: {
            sellerId: id,
          },
        },
      },
    },
  });

  console.log(totalOrders);

  const totalMedicines = await prisma.medicines.count({
    where: {
      sellerId: id,
    },
  });

  const totalRevenue = await prisma.orders.aggregate({
    where: {
      items: {
        some: {
          medicine: {
            sellerId: id,
          },
        },
      },
    },
    _sum: {
      grandTotal: true,
    },
  });

  return {
    meta: {
      totalOrders,
      totalRevenue: totalRevenue?._sum?.grandTotal || 0,
      totalMedicines,
    },
  };
};
const adminMetaData = async () => {
  const totalSeller = await prisma.user.count({
    where: {
      role: "SELLER",
    },
  });
  const totalCustomer = await prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });

  const totalOrders = await prisma.orders.count();

  const totalMedicines = await prisma.medicines.count();

  const totalRevenue = await prisma.orders.aggregate({
    _sum: {
      grandTotal: true,
    },
  });

  return {
    meta: {
      totalOrders,
      totalMedicines,
      totalRevenue: totalRevenue?._sum?.grandTotal || 0,
      totalCustomer,
      totalSeller,
    },
  };
};

const updateProfile = async (id: string, payload: any) => {
  console.log(payload);
  return await prisma.$transaction(async (tx) => {
    if (payload?.user) {
      await tx.user.update({
        where: { id },
        data: {
          name: payload?.user?.name,
          email: payload?.user?.email,
          image: payload?.user?.image,
        },
      });
    }

    const profileData = {
      bio: payload.bio,
      address: payload.address,
      location: payload.location,
      contact_number: payload.contact_number,
    };

    return await tx.profile.upsert({
      where: { userId: id },
      include: { user: true },
      create: {
        userId: id,
        bio: profileData.bio || "",
        address: profileData.address || "Not Provided",
        location: profileData.location || "Not Provided",
        contact_number: profileData.contact_number || "Not Provided",
      },
      update: profileData,
    });
  });
};

export const UserService = {
  getUser,
  updateUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole,
  adminMetaData,
  sellerMetaData,
  updateProfile,
  getProfile,
};
