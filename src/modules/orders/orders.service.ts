import { Prisma, Orders } from "../../../generated/prisma/client";
import { OrdersWhereInput } from "../../../generated/prisma/models";
import { OrdersStatus } from "../../../generated/prisma/enums";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilders";
import {
  ordersSearchableFields,
  ordersFilterableFields,
  ordersIncludeConfig,
} from "../../config/query.config";
import { IQueryParams, IQueryResult } from "../../interface/query.interface";

const createOrder = async ({
  user,
  data,
}: {
  user: RequestUser | undefined;
  data: any;
}) => {
  return await prisma.$transaction(async (tx) => {
    try {
      let totalPrice = 0;
      const orderItemsForPrisma = [];

      for (let item of data.items) {
        const medicine = await tx.medicines.findUnique({
          where: { id: item?.id },
        });

        if (!medicine || medicine.stock < item.quantity) {
          throw new Error(
            `Medicine ${medicine?.name || "Unknown"} is out of stock`,
          );
        }

        const calculatePrice = Number(medicine.price) * item.quantity;
        totalPrice += calculatePrice;

        orderItemsForPrisma.push({
          medicineId: item?.id,
          quantity: item.quantity,
          priceAtPurchase: medicine.price,
        });

        await tx.medicines.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return await tx.orders.create({
        data: {
          ...data,
          customerId: user?.id as string,
          totalPrice,
          items: {
            create: orderItemsForPrisma,
          },
        },
        include: {
          items: true,
        },
      });
    } catch (err) {
      console.error(err);
      return err;
    }
  });
};

const getAllUserOrders = async (
  query: IQueryParams,
  userId: string,
): Promise<IQueryResult<Orders>> => {
  const queryBuilder = new QueryBuilder<
    Orders,
    Prisma.OrdersWhereInput,
    Prisma.OrdersInclude
  >(prisma.orders, query, {
    searchableFields: ordersSearchableFields,
    filterableFields: ordersFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ customerId: userId })
    .dynamicInclude(ordersIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};
const getOrderById = async (
  user: RequestUser | undefined,
  id: string | undefined,
) => {
  return await prisma.orders.findUniqueOrThrow({
    where: {
      id,
      customerId: user?.id,
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      customer: true,
    },
  });
};

// ---------------------------------------------------//

const getAllOrders = async (
  query: IQueryParams,
  userId: string,
): Promise<IQueryResult<Orders>> => {
  const queryBuilder = new QueryBuilder<
    Orders,
    Prisma.OrdersWhereInput,
    Prisma.OrdersInclude
  >(prisma.orders, query, {
    searchableFields: ordersSearchableFields,
    filterableFields: ordersFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      items: {
        some: {
          medicine: { sellerId: userId },
        },
      },
    })
    .dynamicInclude(ordersIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};
const getAllOrdersAdmin = async ({
  options,
  search,
  status,
}: {
  options: PgOptionsRs;
  search: string | undefined;
  status: string | undefined;
}) => {
  const { page, skip, limit, sortBy, sortOrder } = options;
  const conditions: OrdersWhereInput[] = [];

  if (search) {
    conditions.push({
      OR: [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { address: { contains: search, mode: "insensitive" } },
        {
          items: {
            some: {
              medicine: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
      ],
    });
  }

  if (status) {
    conditions.push({
      status: status as OrdersStatus,
    });
  }

  const result = await prisma.orders.findMany({
    skip,
    take: limit,
    where: { AND: conditions },
    include: {
      customer: true,
      items: {
        where: {
          AND: [
            {
              OR: [
                {
                  medicine: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  order: {
                    customer: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          medicine: true,
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.orders.count({
    where: { AND: conditions },
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

const updateOrderStatus = async (
  id: string,
  data: { status?: OrdersStatus },
  user: RequestUser | undefined,
) => {
  const isExist = await prisma.orders.findUniqueOrThrow({
    where: {
      id,
    },
    select: { id: true },
  });

  return await prisma.orders.update({
    where: {
      id: isExist.id,
      items: {
        some: {
          medicine: {
            sellerId: user?.id,
          },
        },
      },
    },
    data: { status: data.status },
  });
};

const updateCustomerOrderStatus = async (
  id: string,
  data: { status?: OrdersStatus },
  user: RequestUser | undefined,
) => {
  const isExist = await prisma.orders.findUniqueOrThrow({
    where: {
      id,
    },
    select: { id: true },
  });

  return await prisma.orders.update({
    where: {
      id: isExist.id,
      customerId: user?.id,
    },
    data: { status: data.status },
  });
};

export const OrderService = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getAllUserOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateCustomerOrderStatus,
};
