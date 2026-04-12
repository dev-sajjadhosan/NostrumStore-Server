import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const seedSuperAdmin = async () => {
  try {
    const superAdminData = {
      name: "Nostrum Store Super Admin",
      email: "nostrum@store.super-admin.com",
      password: "password123",
      role: Role.SUPER_ADMIN,
      emailVerified: true,
    };

    const isExist = await prisma.user.findUnique({
      where: {
        email: superAdminData.email,
      },
    });

    if (isExist) {
      throw new Error("Super Admin Already Exist.");
    }

    const signUpSuperAdmin = await fetch(
      `http://localhost:5000/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(superAdminData),
      },
    );

    if (signUpSuperAdmin.ok) {
      await prisma.user.update({
        where: {
          email: superAdminData.email,
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

// seedSuperAdmin();
