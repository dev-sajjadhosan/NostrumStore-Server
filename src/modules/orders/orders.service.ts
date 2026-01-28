import { OrdersStatus } from "../../../generated/prisma/enums";
import { OrdersWhereInput } from "../../../generated/prisma/models";
import { RequestUser } from "../../@types/express";
import { PgOptionsRs } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";

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
          where: { id: item.medicineId },
        });

        if (!medicine || medicine.stock < item.quantity) {
          throw new Error(
            `Medicine ${medicine?.name || "Unknown"} is out of stock`,
          );
        }

        const calculatePrice = Number(medicine.price) * item.quantity;
        totalPrice += calculatePrice;

        orderItemsForPrisma.push({
          medicineId: item.medicineId,
          quantity: item.quantity,
          priceAtPurchase: medicine.price,
        });

        await tx.medicines.update({
          where: { id: item.medicineId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return await tx.orders.create({
        data: {
          customerId: user?.id as string,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          totalPrice: totalPrice,
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

const getAllOrders = async ({
  user,
  options,
  search,
  status,
}: {
  user: RequestUser | undefined;
  options: PgOptionsRs;
  search: string | undefined;
  status: string | undefined;
}) => {
  const { page, skip, limit, sortBy, sortOrder } = options;
  const conditions: any[] = [];

  const sellerCondition = {
    items: {
      some: {
        medicine: { sellerId: user?.id },
      },
    },
  };
  conditions.push(sellerCondition);

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
      status: status,
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
            { medicine: { sellerId: user?.id } },

            search
              ? {
                  medicine: { name: { contains: search, mode: "insensitive" } },
                }
              : {},
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

  console.log(isExist);

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

export const OrderService = { createOrder, getAllOrders, updateOrderStatus };
