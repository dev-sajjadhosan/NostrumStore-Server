/*
  Warnings:

  - Added the required column `payment` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "Shipping" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "Subtotal" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "Tax" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "grandTotal" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "payment" TEXT NOT NULL;
