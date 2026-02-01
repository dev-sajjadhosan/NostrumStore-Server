var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import "dotenv/config";

// src/app.ts
import express from "express";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.configDotenv({
  path: path.join(process.cwd(), ".env")
});
var config = {
  port: process.env.PORT,
  version: process.env.API_VERSION,
  app_url: process.env.APP_URL,
  better_secret: process.env.BETTER_AUTH_SECRET,
  better_url: process.env.BETTER_AUTH_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SEC,
  discord_client_id: process.env.DISCORD_CLIENT_ID,
  discord_client_secret: process.env.DISCORD_CLIENT_SEC,
  app_user: process.env.APP_USER,
  app_pass: process.env.APP_PASS
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum Status {\n  BAN\n  UNBAN\n}\n\nmodel User {\n  id            String      @id\n  name          String\n  email         String\n  emailVerified Boolean     @default(false)\n  image         String?\n  createdAt     DateTime    @default(now())\n  updatedAt     DateTime    @updatedAt\n  role          Role        @default(CUSTOMER)\n  status        Status      @default(UNBAN)\n  sessions      Session[]\n  accounts      Account[]\n  profile       Profile?\n  medicines     Medicines[]\n  orders        Orders[]\n  reviews       Reviews[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Profile {\n  id             String  @id @default(uuid())\n  userId         String  @unique\n  user           User    @relation(fields: [userId], references: [id])\n  bio            String? @db.VarChar(300)\n  address        String\n  location       String\n  contact_number String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum CategoryStatus {\n  ACTIVE\n  RESTRICTED\n  INACTIVE\n}\n\nmodel Categories {\n  id          String         @id @default(uuid())\n  name        String         @unique\n  image       String?\n  description String?\n  status      CategoryStatus @default(ACTIVE)\n  medicines   Medicines[]\n  slug        String         @unique\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum UnitType {\n  Pcs\n  Strip\n  Box\n  Bottle\n}\n\nmodel Medicines {\n  id         String     @id @default(uuid())\n  sellerId   String\n  seller     User       @relation(fields: [sellerId], references: [id])\n  categoryId String\n  category   Categories @relation(fields: [categoryId], references: [id])\n\n  name        String   @db.VarChar(200)\n  genericName String   @db.VarChar(200)\n  strength    String?  @db.VarChar(50)\n  unitType    UnitType @default(Pcs)\n\n  group       String? @db.VarChar(255)\n  description String  @db.Text\n\n  price         Decimal  @db.Decimal(10, 2)\n  discountPrice Decimal? @db.Decimal(10, 2)\n  stock         Int      @default(0)\n\n  image String\n  tags  String[]\n\n  isPrescriptionRequired Boolean   @default(false)\n  expiryDate             DateTime?\n  sku                    String?   @db.VarChar(100)\n\n  views   Int         @default(0)\n  orders  OrderItem[]\n  reviews Reviews[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([name, sellerId])\n  @@index([categoryId])\n}\n\n// Transactions.prisma\nenum OrdersStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Orders {\n  id         String       @id @default(uuid())\n  customerId String\n  customer   User         @relation(fields: [customerId], references: [id])\n  totalPrice Decimal      @db.Decimal(10, 2)\n  status     OrdersStatus @default(PENDING)\n  address    String\n  phone      String?\n  whatsapp   String?\n\n  items OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel OrderItem {\n  id         String    @id @default(uuid())\n  orderId    String\n  order      Orders    @relation(fields: [orderId], references: [id])\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id])\n\n  quantity        Int      @default(1)\n  priceAtPurchase Decimal  @db.Decimal(10, 2)\n  createdAt       DateTime @default(now())\n  updatedAt       DateTime @updatedAt\n}\n\nmodel Reviews {\n  id         String    @id @default(uuid())\n  userId     String\n  user       User      @relation(fields: [userId], references: [id])\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id])\n\n  rating  Int\n  comment String @db.Text\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"contact_number","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CategoryStatus"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"CategoriesToMedicines"},{"name":"slug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicines":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"MedicinesToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToMedicines"},{"name":"name","kind":"scalar","type":"String"},{"name":"genericName","kind":"scalar","type":"String"},{"name":"strength","kind":"scalar","type":"String"},{"name":"unitType","kind":"enum","type":"UnitType"},{"name":"group","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"discountPrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"isPrescriptionRequired","kind":"scalar","type":"Boolean"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"sku","kind":"scalar","type":"String"},{"name":"views","kind":"scalar","type":"Int"},{"name":"orders","kind":"object","type":"OrderItem","relationName":"MedicinesToOrderItem"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MedicinesToReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrdersStatus"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"whatsapp","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"priceAtPurchase","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewsToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToReviews"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoriesScalarFieldEnum: () => CategoriesScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicinesScalarFieldEnum: () => MedicinesScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrdersScalarFieldEnum: () => OrdersScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Profile: "Profile",
  Categories: "Categories",
  Medicines: "Medicines",
  Orders: "Orders",
  OrderItem: "OrderItem",
  Reviews: "Reviews"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  address: "address",
  location: "location",
  contact_number: "contact_number",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoriesScalarFieldEnum = {
  id: "id",
  name: "name",
  image: "image",
  description: "description",
  status: "status",
  slug: "slug",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicinesScalarFieldEnum = {
  id: "id",
  sellerId: "sellerId",
  categoryId: "categoryId",
  name: "name",
  genericName: "genericName",
  strength: "strength",
  unitType: "unitType",
  group: "group",
  description: "description",
  price: "price",
  discountPrice: "discountPrice",
  stock: "stock",
  image: "image",
  tags: "tags",
  isPrescriptionRequired: "isPrescriptionRequired",
  expiryDate: "expiryDate",
  sku: "sku",
  views: "views",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrdersScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  totalPrice: "totalPrice",
  status: "status",
  address: "address",
  phone: "phone",
  whatsapp: "whatsapp",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  priceAtPurchase: "priceAtPurchase",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  userId: "userId",
  medicineId: "medicineId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/helpers/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.app_user,
    pass: config.app_pass
  }
});
var nodemailerTransporter = transporter;

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "UNBAN",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
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
</html>`
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      clientId: config.google_client_id,
      clientSecret: config.google_client_secret
    },
    discord: {
      clientId: config.discord_client_id,
      clientSecret: config.discord_client_secret
    }
  }
});

// src/modules/user/user.routes.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// src/modules/user/user.service.ts
var getUser = async (user) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email
    },
    include: {
      profile: true
    }
  });
};
var updateUser = async (user, data) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email
    },
    select: {
      id: true
    }
  });
  if (data.role || data.emailVerified || data.status) {
    delete data.role;
    delete data.emailVerified;
    delete data.status;
  }
  return await prisma.user.update({
    where: {
      id: isExist.id
    },
    data
  });
};
var getAllUsers = async ({
  options,
  search,
  user,
  role,
  status
}) => {
  const { page, limit, skip, sortBy, sortOrder } = options;
  const conditions = [];
  if (search) {
    conditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (role) {
    conditions.push({
      role
    });
  }
  if (status) {
    conditions.push({
      status
    });
  }
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: conditions
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: conditions
    }
  });
  return {
    data: result.filter((r) => r.id !== user?.id),
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
      total
    }
  };
};
var updateUserStatus = async (id, data) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { id: true }
  });
  return await prisma.user.update({
    where: {
      id: isExist.id
    },
    data: {
      status: data?.status
    }
  });
};
var updateUserRole = async (id, data) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: { id }
  });
  if (isExist.role === data?.role) {
    return isExist;
  }
  return await prisma.user.update({
    where: {
      id: isExist.id
    },
    data: {
      role: data.role
    }
  });
};
var deleteUser = async (id) => {
  return await prisma.user.delete({
    where: {
      id
    }
  });
};
var UserService = {
  getUser,
  updateUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole
};

// src/helpers/paginationHelpers.ts
var paginationHelpers = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
};

// src/modules/user/user.controller.ts
var getUser2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const result = await UserService.getUser(user);
  res.status(200).json({
    data: result,
    success: true,
    message: "User fetched success."
  });
});
var updateUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;
  const result = await UserService.updateUser(user, data);
  res.status(201).json({ data: result, success: true, message: "User update success." });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const { search, status, role } = req.query;
  const options = paginationHelpers(req.params);
  const isSearch = typeof search === "string" ? search : void 0;
  const isStatus = typeof status === "string" ? status : void 0;
  const isRole = typeof status === "string" ? role : void 0;
  const result = await UserService.getAllUsers({
    options,
    search: isSearch,
    user,
    role: isRole,
    status: isStatus
  });
  res.status(200).json({
    success: true,
    message: "Users fetched successfully!",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await UserService.updateUserStatus(id, data);
  res.status(201).json({
    success: true,
    message: "User status updated!",
    data: result
  });
});
var updateUserRole2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await UserService.updateUserRole(id, data);
  res.status(201).json({
    success: true,
    message: "User Role updated!",
    data: result
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id);
  res.status(200).json({
    success: true,
    message: "User delete successfully!",
    data: result
  });
});
var UserController = {
  getUser: getUser2,
  updateUser: updateUser2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  deleteUser: deleteUser2,
  updateUserRole: updateUserRole2
};

// src/middleware/protect.ts
var protect = async (req, res, next) => {
  try {
    let session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(401).json({ success: false, message: "You are not authorize." });
    }
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      emailVerified: session.user.emailVerified
    };
    next();
  } catch (err) {
    throw err;
  }
};

// src/middleware/restrictRoles.ts
var restrictRole = (...roles) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req?.user?.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden! You don't have permission to access this resources!"
      });
    }
    next();
  };
};

// src/modules/user/user.routes.ts
var router = Router();
router.get("/profile/me", protect, UserController.getUser);
router.patch("/profile/me", protect, UserController.updateUser);
router.patch("/profile/role/:id", protect, UserController.updateUserRole);
router.get(
  "/admin/users",
  protect,
  restrictRole("ADMIN"),
  UserController.getAllUsers
);
router.patch(
  "/admin/users/:id",
  protect,
  restrictRole("ADMIN"),
  UserController.updateUserStatus
);
router.delete(
  "/profile/me",
  protect,
  restrictRole("CUSTOMER"),
  UserController.deleteUser
);
router.delete(
  "/admin/users/:id",
  protect,
  restrictRole("ADMIN"),
  UserController.deleteUser
);
var UserRoutes = router;

// src/middleware/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = "";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Missing or Incorrect type fields!";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error.";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error Occurred during query execution.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. Please check your credentials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't reach database server!";
    }
  }
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details: err
  });
};

// src/middleware/routeNotFound.ts
var notFoundRoutes = (req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: `The requested path '${req.originalUrl}' does not exist on this server.`
      }
    ],
    // ISO format is the standard for APIs (e.g., 2026-01-27T10:55:00Z)
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
};

// src/modules/medicines/medicines.routes.ts
import { Router as Router2 } from "express";

// src/modules/medicines/medicines.service.ts
var getAllMedicines = async ({
  search,
  tags,
  options
}) => {
  const { limit: take, page, skip, sortBy, sortOrder } = options;
  const conditions = [];
  if (search) {
    conditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          group: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          tags: {
            has: search
          }
        }
      ]
    });
  }
  if (tags.length > 0) {
    conditions.push({
      tags: {
        hasEvery: tags
      }
    });
  }
  const result = await prisma.medicines.findMany({
    take,
    skip,
    where: {
      AND: conditions
    },
    include: {
      category: true
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.medicines.count({
    where: {
      AND: conditions
    }
  });
  return {
    data: result,
    pagination: {
      search,
      page,
      limit: take,
      total,
      pages: Math.ceil(total / take)
    }
  };
};
var getSingleMedicineById = async (id) => {
  await prisma.medicines.update({
    where: { id },
    data: {
      views: {
        increment: 1
      }
    }
  });
  return prisma.medicines.findUniqueOrThrow({
    where: { id }
  });
};
var createMedicine = async ({
  user,
  data
}) => {
  console.log(data);
  const formattedData = {
    ...data,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    image: data.image || "default-placeholder.png",
    sellerId: user?.id
  };
  return await prisma.medicines.create({
    data: formattedData
  });
};
var updateMedicine = async ({
  id,
  user,
  data
}) => {
  const isExist = await prisma.medicines.findUnique({
    where: { id },
    select: { id: true }
  });
  return await prisma.medicines.update({
    where: { id: isExist?.id, sellerId: user?.id },
    data
  });
};
var deleteMedicine = async (id) => {
  return await prisma.medicines.delete({
    where: { id }
  });
};
var MedicinesService = {
  getAllMedicines,
  getSingleMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine
};

// src/modules/medicines/medicines.controller.ts
var getAllMedicines2 = catchAsync(async (req, res) => {
  const { search } = req.query;
  const isSearch = typeof search === "string" ? search : void 0;
  const tags = req.query.tags ? req.query.tags.split(",") : [];
  const options = paginationHelpers(req.query);
  const { data, pagination } = await MedicinesService.getAllMedicines({
    search: isSearch,
    tags,
    options
  });
  if (data.length <= 0) {
    return res.status(200).json({
      success: true,
      message: "Medicine fetched success.",
      empty: true,
      data: []
    });
  }
  res.status(200).json({
    success: true,
    message: "Medicine fetched success.",
    data: { data, pagination }
  });
});
var createMedicine2 = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;
  const result = await MedicinesService.createMedicine({ user, data });
  console.log(result);
  res.status(201).json({
    success: true,
    message: "Medicine created successfully.",
    data: result
  });
});
var getSingleMedicineById2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await MedicinesService.getSingleMedicineById(id);
    res.status(200).json({
      success: true,
      message: "Medicine data fetched successfully.",
      data: result
    });
  }
);
var updateMedicine2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const { id } = req.params;
  const data = req.body;
  const result = await MedicinesService.updateMedicine({ id, user, data });
  res.status(201).json({
    success: true,
    message: "Medicine updated successfully.",
    data: result
  });
});
var deleteMedicine2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MedicinesService.deleteMedicine(id);
  res.status(200).json({
    success: true,
    message: "Medicine delete successfully.",
    data: result
  });
});
var MedicinesController = {
  getAllMedicines: getAllMedicines2,
  getSingleMedicineById: getSingleMedicineById2,
  createMedicine: createMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2
};

// src/modules/medicines/medicines.routes.ts
var router2 = Router2();
router2.get("/medicines", MedicinesController.getAllMedicines);
router2.get("/medicines/:id", MedicinesController.getSingleMedicineById);
router2.post(
  "/seller/medicines",
  protect,
  restrictRole("SELLER"),
  MedicinesController.createMedicine
);
router2.put(
  "/seller/medicines/:id",
  protect,
  restrictRole("SELLER"),
  MedicinesController.updateMedicine
);
router2.delete(
  "/seller/medicines/:id",
  protect,
  restrictRole("SELLER"),
  MedicinesController.deleteMedicine
);
var MedicinesRoutes = router2;

// src/modules/categories/categories.routes.ts
import { Router as Router3 } from "express";

// src/modules/categories/categories.service.ts
var createCategories = async ({ data }) => {
  return prisma.categories.create({
    data
  });
};
var getAllCategories = async ({
  search,
  options
}) => {
  const { page, limit: take, skip, sortBy, sortOrder } = options;
  const result = await prisma.categories.findMany({
    take,
    skip,
    where: {
      AND: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      }
    },
    include: { medicines: true },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.categories.count({
    where: {
      AND: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      }
    }
  });
  return {
    data: result,
    pagination: {
      page,
      pages: Math.ceil(total / take),
      limit: take,
      total
    }
  };
};
var getSingleCategoriesById = async (id) => {
  return prisma.categories.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      medicines: true
    }
  });
};
var updateCategoryStatus = async (id, data) => {
  const isExist = await prisma.categories.findFirstOrThrow({
    where: { id },
    select: { id: true, status: true }
  });
  if (data?.status === isExist.status) {
    return "Status already exist.";
  }
  if (data.status) {
    return prisma.categories.update({
      where: { id: isExist.id },
      data: {
        status: data?.status
      }
    });
  }
  return "Action can't perform.";
};
var deleteCategories = async (id) => {
  const isExist = await prisma.categories.findFirstOrThrow({
    where: { id },
    select: { id: true }
  });
  return prisma.categories.delete({
    where: { id: isExist.id }
  });
};
var CategoriesService = {
  createCategories,
  getAllCategories,
  getSingleCategoriesById,
  updateCategoryStatus,
  deleteCategories
};

// src/modules/categories/categories.controller.ts
var createCategories2 = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await CategoriesService.createCategories({ data });
  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const { search } = req.query;
  const isSearch = typeof search === "string" ? search : void 0;
  const options = paginationHelpers(req.query);
  const { data, pagination } = await CategoriesService.getAllCategories({
    search: isSearch,
    options
  });
  if (data.length <= 0) {
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      empty: true,
      data: []
    });
  }
  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: { data, pagination }
  });
});
var getSingleCategoriesById2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await CategoriesService.getSingleCategoriesById(
      id
    );
    res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: result
    });
  }
);
var updateCategoryStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CategoriesService.updateCategoryStatus(
    id,
    data
  );
  res.status(201).json({
    success: true,
    message: "Category status change.",
    data: result
  });
});
var deleteCategories2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoriesService.deleteCategories(id);
  res.status(200).json({
    success: true,
    message: "Category delete successfully.",
    data: result
  });
});
var CategoriesController = {
  createCategories: createCategories2,
  getAllCategories: getAllCategories2,
  getSingleCategoriesById: getSingleCategoriesById2,
  updateCategoryStatus: updateCategoryStatus2,
  deleteCategories: deleteCategories2
};

// src/modules/categories/categories.routes.ts
var router3 = Router3();
router3.get("/", CategoriesController.getAllCategories);
router3.get("/:id", CategoriesController.getSingleCategoriesById);
router3.post(
  "/",
  protect,
  restrictRole("ADMIN"),
  CategoriesController.createCategories
);
router3.put(
  "/:id",
  protect,
  restrictRole("ADMIN"),
  CategoriesController.updateCategoryStatus
);
router3.delete(
  "/:id",
  protect,
  restrictRole("ADMIN"),
  CategoriesController.deleteCategories
);
var CategoriesRouter = router3;

// src/modules/orders/orders.routes.ts
import { Router as Router4 } from "express";

// src/modules/orders/orders.service.ts
var createOrder = async ({
  user,
  data
}) => {
  return await prisma.$transaction(async (tx) => {
    try {
      let totalPrice = 0;
      const orderItemsForPrisma = [];
      for (let item of data.items) {
        const medicine = await tx.medicines.findUnique({
          where: { id: item.medicineId }
        });
        if (!medicine || medicine.stock < item.quantity) {
          throw new Error(
            `Medicine ${medicine?.name || "Unknown"} is out of stock`
          );
        }
        const calculatePrice = Number(medicine.price) * item.quantity;
        totalPrice += calculatePrice;
        orderItemsForPrisma.push({
          medicineId: item.medicineId,
          quantity: item.quantity,
          priceAtPurchase: medicine.price
        });
        await tx.medicines.update({
          where: { id: item.medicineId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }
      return await tx.orders.create({
        data: {
          customerId: user?.id,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          totalPrice,
          items: {
            create: orderItemsForPrisma
          }
        },
        include: {
          items: true
        }
      });
    } catch (err) {
      console.error(err);
      return err;
    }
  });
};
var getAllUserOrders = async ({
  user,
  options,
  search,
  status
}) => {
  const { page, skip, limit, sortBy, sortOrder } = options;
  const conditions = [];
  conditions.push({
    customerId: user?.id
  });
  if (search) {
    conditions.push({
      OR: [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { address: { contains: search, mode: "insensitive" } },
        {
          items: {
            some: {
              medicine: { name: { contains: search, mode: "insensitive" } }
            }
          }
        }
      ]
    });
  }
  if (status) {
    conditions.push({
      status
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
            search ? {
              medicine: { name: { contains: search, mode: "insensitive" } }
            } : {}
          ]
        },
        include: {
          medicine: true
        }
      }
    },
    orderBy: { [sortBy]: sortOrder }
  });
  const total = await prisma.orders.count({
    where: { AND: conditions }
  });
  return {
    data: result,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
      total
    }
  };
};
var getOrderById = async (user, id) => {
  return await prisma.orders.findUniqueOrThrow({
    where: {
      id,
      customerId: user?.id
    },
    include: {
      items: true
    }
  });
};
var getAllOrders = async ({
  user,
  options,
  search,
  status
}) => {
  const { page, skip, limit, sortBy, sortOrder } = options;
  const conditions = [];
  const sellerCondition = {
    items: {
      some: {
        medicine: { sellerId: user?.id }
      }
    }
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
              medicine: { name: { contains: search, mode: "insensitive" } }
            }
          }
        }
      ]
    });
  }
  if (status) {
    conditions.push({
      status
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
            search ? {
              medicine: { name: { contains: search, mode: "insensitive" } }
            } : {}
          ]
        },
        include: {
          medicine: true
        }
      }
    },
    orderBy: { [sortBy]: sortOrder }
  });
  const total = await prisma.orders.count({
    where: { AND: conditions }
  });
  return {
    data: result,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
      total
    }
  };
};
var getAllOrdersAdmin = async ({
  options,
  search,
  status
}) => {
  const { page, skip, limit, sortBy, sortOrder } = options;
  const conditions = [];
  if (search) {
    conditions.push({
      OR: [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { address: { contains: search, mode: "insensitive" } },
        {
          items: {
            some: {
              medicine: { name: { contains: search, mode: "insensitive" } }
            }
          }
        }
      ]
    });
  }
  if (status) {
    conditions.push({
      status
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
                      mode: "insensitive"
                    }
                  }
                },
                {
                  order: {
                    customer: {
                      name: {
                        contains: search,
                        mode: "insensitive"
                      }
                    }
                  }
                }
              ]
            }
          ]
        },
        include: {
          medicine: true
        }
      }
    },
    orderBy: { [sortBy]: sortOrder }
  });
  const total = await prisma.orders.count({
    where: { AND: conditions }
  });
  return {
    data: result,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
      total
    }
  };
};
var updateOrderStatus = async (id, data, user) => {
  const isExist = await prisma.orders.findUniqueOrThrow({
    where: {
      id
    },
    select: { id: true }
  });
  console.log(isExist);
  return await prisma.orders.update({
    where: {
      id: isExist.id,
      items: {
        some: {
          medicine: {
            sellerId: user?.id
          }
        }
      }
    },
    data: { status: data.status }
  });
};
var OrderService = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getAllUserOrders,
  getOrderById,
  getAllOrdersAdmin
};

// src/modules/orders/orders.controller.ts
var createOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;
  const result = await OrderService.createOrder({ user, data });
  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: result
  });
});
var getAllUserOrders2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const { search, status } = req.query;
  const isSearch = typeof search === "string" ? search : void 0;
  const isStatus = typeof status === "string" ? status : void 0;
  const options = paginationHelpers(req.query);
  const result = await OrderService.getAllOrders({
    user,
    options,
    search: isSearch,
    status: isStatus
  });
  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    data: result
  });
});
var getOrderById2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await OrderService.getOrderById(user, id);
  res.status(200).json({
    success: true,
    message: "Order fetched successfully!",
    data: result
  });
});
var getAllOrders2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const { search, status } = req.query;
  const isSearch = typeof search === "string" ? search : void 0;
  const isStatus = typeof status === "string" ? status : void 0;
  const options = paginationHelpers(req.query);
  const result = await OrderService.getAllOrders({
    user,
    options,
    search: isSearch,
    status: isStatus
  });
  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    data: result
  });
});
var getAllOrdersAdmin2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const { search, status } = req.query;
  const isSearch = typeof search === "string" ? search : void 0;
  const isStatus = typeof status === "string" ? status : void 0;
  const options = paginationHelpers(req.query);
  const result = await OrderService.getAllOrdersAdmin({
    options,
    search: isSearch,
    status: isStatus
  });
  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    data: result
  });
});
var updateOrderStatus2 = catchAsync(async (req, res) => {
  const user = req?.user;
  const { id } = req.params;
  const body = req.body;
  const result = await OrderService.updateOrderStatus(id, body, user);
  res.status(201).json({
    success: true,
    message: `Order ${result?.customerId} has been updated!`,
    data: result
  });
});
var OrderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  updateOrderStatus: updateOrderStatus2,
  getAllUserOrders: getAllUserOrders2,
  getOrderById: getOrderById2,
  getAllOrdersAdmin: getAllOrdersAdmin2
};

// src/modules/orders/orders.routes.ts
var router4 = Router4();
router4.post(
  "/orders",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.createOrder
);
router4.get(
  "/orders",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.getAllUserOrders
);
router4.get(
  "/orders/:id",
  protect,
  restrictRole("CUSTOMER"),
  OrderController.getOrderById
);
router4.get(
  "/seller/orders",
  protect,
  restrictRole("SELLER"),
  OrderController.getAllOrders
);
router4.get(
  "/admin/orders",
  protect,
  restrictRole("ADMIN"),
  OrderController.getAllOrdersAdmin
);
router4.patch(
  "/seller/orders/:id",
  protect,
  restrictRole("SELLER"),
  OrderController.updateOrderStatus
);
var OrdersRoutes = router4;

// src/app.ts
var app = express();
app.use(express.json());
app.use(
  cors({
    origin: config.app_url || "http://localhost:3000",
    credentials: true
  })
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nostrum Store API Gateway",
    data: {
      name: "Nostrum Store",
      version: config.version || "v1",
      status: "healthy",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", UserRoutes);
app.use("/api", MedicinesRoutes);
app.use("/api/categories", CategoriesRouter);
app.use("/api", OrdersRoutes);
app.use(errorHandler);
app.use(notFoundRoutes);
var app_default = app;

// src/server.ts
var port = config.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    app_default.listen(port, () => {
      console.log(`The Server is running on Port: [${port}]`);
      console.log(`Url: http://localhost:${port}`);
    });
  } catch (err) {
    console.log("An error occurred: ", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
