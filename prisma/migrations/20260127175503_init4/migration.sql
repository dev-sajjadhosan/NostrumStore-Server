-- DropForeignKey
ALTER TABLE "Medicines" DROP CONSTRAINT "Medicines_categoryId_fkey";

-- AlterTable
ALTER TABLE "Medicines" ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Categories_name_idx" ON "Categories"("name");

-- AddForeignKey
ALTER TABLE "Medicines" ADD CONSTRAINT "Medicines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
