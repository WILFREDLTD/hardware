/*
  Warnings:

  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "hardware"."products_sku_idx";

-- DropIndex
DROP INDEX "hardware"."products_sku_key";

-- AlterTable
ALTER TABLE "hardware"."products" DROP COLUMN "sku",
ADD COLUMN     "nickname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_nickname_key" ON "hardware"."products"("nickname");

-- CreateIndex
CREATE INDEX "products_nickname_idx" ON "hardware"."products"("nickname");
