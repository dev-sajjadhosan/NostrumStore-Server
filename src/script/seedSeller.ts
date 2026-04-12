import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const seedSeller = async () => {
  try {
    const sellerData = {
      name: "Nostrum Store Seller",
      email: "nostrum@store.seller.com",
      password: "password123",
      role: Role.SELLER,
      emailVerified: true,
    };

    const isExist = await prisma.user.findUnique({
      where: {
        email: sellerData.email,
      },
    });

    if (isExist) {
      throw new Error("Seller Already Exist.");
    }

    const signUpSeller = await fetch(
      `http://localhost:5000/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(sellerData),
      },
    );

    if (signUpSeller.ok) {
      await prisma.user.update({
        where: {
          email: sellerData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// seedSeller();
