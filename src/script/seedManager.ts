import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const seedManager = async () => {
  try {
    const managerData = {
      name: "Nostrum Store Manager",
      email: "nostrum@store.manager.com",
      password: "password123",
      role: Role.MANAGER,
      emailVerified: true,
    };

    const isExist = await prisma.user.findUnique({
      where: {
        email: managerData.email,
      },
    });

    if (isExist) {
      throw new Error("Manager Already Exist.");
    }

    const signUpManager = await fetch(
      `http://localhost:5000/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(managerData),
      },
    );

    if (signUpManager.ok) {
      await prisma.user.update({
        where: {
          email: managerData.email,
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

// seedManager();
//
