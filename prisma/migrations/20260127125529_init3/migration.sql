/*
  Warnings:

  - A unique constraint covering the columns `[name,sellerId]` on the table `Medicines` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Medicines_categoryId_idx" ON "Medicines"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Medicines_name_sellerId_key" ON "Medicines"("name", "sellerId");
