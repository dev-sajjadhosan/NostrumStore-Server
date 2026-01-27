import { Role } from "../../generated/prisma/enums";
import { config } from "../config";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Nostrum Store",
      email: "nostrum@store.com",
      password: "password123",
      role: Role.ADMIN,
      emailVerified: true,
    };

    const isExist = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (isExist) {
      throw new Error("Admin Already Exist.");
    }

    const signUpAdmin = await fetch(
      `http://localhost:5000/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
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

seedAdmin();
