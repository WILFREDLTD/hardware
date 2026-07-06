/*
  Warnings:

  - You are about to drop the column `packageCount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `packagePrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hardware"."products" DROP COLUMN "packageCount",
DROP COLUMN "packagePrice";

-- AlterTable
ALTER TABLE "hardware"."sales" ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "discountAppliedAt" TIMESTAMP(3),
ADD COLUMN     "discountAppliedBy" TEXT,
ADD COLUMN     "subtotalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
