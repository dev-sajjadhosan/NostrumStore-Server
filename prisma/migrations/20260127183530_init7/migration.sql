-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('BAN', 'UNBAN');

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "status" "CategoryStatus" NOT NULL DEFAULT 'UNBAN';
