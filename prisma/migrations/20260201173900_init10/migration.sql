/*
  Warnings:

  - Added the required column `genericName` to the `Medicines` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('Pcs', 'Strip', 'Box', 'Bottle');

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Medicines" ADD COLUMN     "discountPrice" DECIMAL(10,2),
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "genericName" VARCHAR(200) NOT NULL,
ADD COLUMN     "isPrescriptionRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sku" VARCHAR(100),
ADD COLUMN     "strength" VARCHAR(50),
ADD COLUMN     "unitType" "UnitType" NOT NULL DEFAULT 'Pcs';
