/*
  Warnings:

  - You are about to drop the column `packageCount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `packagePrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hardware"."products" DROP COLUMN "packageCount",
DROP COLUMN "packagePrice";
