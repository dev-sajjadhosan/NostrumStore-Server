import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { config } from "../config";
import { nodemailerTransporter } from "../helpers/nodemailer";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: false,
    },
    sameSite: "none",
  },
  trustedOrigins: [
    "http://localhost:3000",
    config.app_url as string,
    "https://nostrum-store.vercel.app",
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
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        const verificationUrl = `${config.app_url}/verify-email?token=${token}`;
        const info = await nodemailerTransporter.sendMail({
          from: '"Nostrum Store" <nustrum-store@gmail.com>',
          to: user.email,
          subject: "Please Verify Your email",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Nostrum Store Account</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f7f6;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            border: 1px solid #d1d8d7; 
            border-radius: 12px; 
            overflow: hidden; 
            background-color: #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .header { 
            background-color: #00a69c; 
            padding: 40px 20px; 
            text-align: center; 
            color: #ffffff; 
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 1px;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content { 
            padding: 40px; 
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #00a69c;
        }
        .button-container { 
            text-align: center; 
            margin: 35px 0; 
        }
        .button { 
            background-color: #00a69c; 
            color: #ffffff !important; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            display: inline-block;
            transition: background-color 0.3s ease;
        }
        .benefit-box {
            background-color: #f0f9f8;
            border-left: 4px solid #00a69c;
            padding: 15px 20px;
            margin: 25px 0;
        }
        .benefit-box strong {
            color: #00a69c;
        }
        .footer { 
            background-color: #f9f9f9; 
            padding: 30px 20px; 
            text-align: center; 
            font-size: 13px; 
            color: #7f8c8d;
            border-top: 1px solid #eeeeee;
        }
        .link-alt { 
            word-break: break-all; 
            color: #00a69c; 
            font-size: 12px;
            background: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            display: block;
        }
        .store-name { 
            color: #00a69c; 
            font-weight: bold; 
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Brand Header -->
        <div class="header">
            <h1>NOSTRUM STORE</h1>
            <p>Find and Get all your Medicines</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <p class="greeting">Hello ${user?.name || "Valued Customer"},</p>
            <p>Thank you for choosing <span class="store-name">Nostrum Store</span>, your trusted partner for daily health and medicine needs. We are dedicated to providing you with quality care and fast service.</p>
            
            <p>To secure your account and access our full range of pharmaceutical services, please verify your email address below:</p>
            
            <div class="button-container">
                <a href="${verificationUrl || "#"}" class="button">Confirm Email Address</a>
            </div>

            <div class="benefit-box">
                <strong>Why verify?</strong> Verified members can track prescriptions, save delivery preferences, and receive exclusive health alerts.
            </div>
            
            <p style="font-size: 14px; margin-top: 30px;">If the button above doesn't work, please copy and paste this URL into your browser:</p>
            <span class="link-alt">${verificationUrl || "https://nostrum-store.com/verify-email"}</span>
            
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #95a5a6; text-align: center;">
                If you did not create an account with us, you can safely ignore this email. No further action is required.
            </p>
        </div>

        <!-- Brand Footer -->
        <div class="footer">
            <strong>Nostrum Store Inc.</strong><br>
            Dhaka, Bangladesh | Support: support@nostrumstore.com<br>
            <p style="margin-top: 15px;">&copy; 2026 Nostrum Store. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        });
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },
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
});
