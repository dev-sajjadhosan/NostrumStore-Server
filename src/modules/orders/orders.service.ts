import { RequestUser } from "../../@types/express";
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

export const OrderService = { createOrder };
