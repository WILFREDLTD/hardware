/*
  Warnings:

  - Made the column `createdAt` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "hardware"."categories" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "hardware"."users" ADD COLUMN     "autoLockTimeoutMinutes" INTEGER DEFAULT 1;
