import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { config } from "../config";
import { sendEmail } from "../utils/email";
import { Role } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Nostrum Store",
  baseURL: config.better_url,
  secret: config.better_secret,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://nostrum-store.vercel.app",
    "https://nostrum-store-server.vercel.app",
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "UNBAN",
        required: false,
      },
      needPasswordChange: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: config.google_client_id as string,
      clientSecret: config.google_client_secret as string,
    },
    discord: {
      clientId: config.discord_client_id as string,
      clientSecret: config.discord_client_secret as string,
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            console.error(
              `User with email ${email} not found. Cannot send verification OTP.`,
            );
            return;
          }

          if (
            (user && user.role === Role.SUPER_ADMIN) ||
            user.role === Role.ADMIN ||
            user.role === Role.MANAGER
          ) {
            console.error(
              `User with email ${email} is a ${user?.role}. Skipping sending verification OTP.`,
            );
            return;
          }

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Email Verification",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Forget Password",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 5 * 60,
      otpLength: 6,
    }),
  ],
});
