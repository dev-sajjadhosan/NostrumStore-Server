/*
  Warnings:

  - The values [RESTRICT] on the enum `CategoryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryStatus_new" AS ENUM ('ACTIVE', 'RESTRICTED', 'INACTIVE');
ALTER TABLE "public"."Categories" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Categories" ALTER COLUMN "status" TYPE "CategoryStatus_new" USING ("status"::text::"CategoryStatus_new");
ALTER TYPE "CategoryStatus" RENAME TO "CategoryStatus_old";
ALTER TYPE "CategoryStatus_new" RENAME TO "CategoryStatus";
DROP TYPE "public"."CategoryStatus_old";
ALTER TABLE "Categories" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
