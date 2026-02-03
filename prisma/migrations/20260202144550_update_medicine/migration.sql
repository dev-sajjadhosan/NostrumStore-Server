/*
  Warnings:

  - Added the required column `overview` to the `Medicines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicines" ADD COLUMN     "overview" TEXT NOT NULL;
