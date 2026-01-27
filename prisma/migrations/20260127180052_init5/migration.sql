/*
  Warnings:

  - Made the column `categoryId` on table `Medicines` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Medicines" DROP CONSTRAINT "Medicines_categoryId_fkey";

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Medicines" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Medicines" ADD CONSTRAINT "Medicines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
