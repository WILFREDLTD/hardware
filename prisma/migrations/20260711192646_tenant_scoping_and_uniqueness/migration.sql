/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `hardware_lists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,sku]` on the table `hardwares` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,nickname]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `debt_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `debts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `inventory_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "hardware"."categories_name_key";

-- DropIndex
DROP INDEX "hardware"."hardwares_sku_idx";

-- DropIndex
DROP INDEX "hardware"."hardwares_sku_key";

-- DropIndex
DROP INDEX "hardware"."products_nickname_key";

-- AlterTable
ALTER TABLE "hardware"."categories" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "hardware"."debt_payments" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "hardware"."debts" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "hardware"."inventory_transactions" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "hardware"."reports" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "hardware"."sales" ADD COLUMN     "userId" TEXT;

-- Fill existing rows with the closest available owner
UPDATE "hardware"."categories"
SET "userId" = (SELECT id FROM "hardware"."users" ORDER BY "createdAt" LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "hardware"."sales" AS s
SET "userId" = COALESCE(
  (
    SELECT p."userId"
    FROM "hardware"."sale_items" AS si
    JOIN "hardware"."products" AS p ON p.id = si."productId"
    WHERE si."saleId" = s.id
    ORDER BY p."userId"
    LIMIT 1
  ),
  (SELECT id FROM "hardware"."users" ORDER BY "createdAt" LIMIT 1)
)
WHERE "userId" IS NULL;

UPDATE "hardware"."debts" AS d
SET "userId" = COALESCE(
  (
    SELECT s."userId"
    FROM "hardware"."sales" AS s
    WHERE s.id = d."saleId"
    LIMIT 1
  ),
  (
    SELECT p."userId"
    FROM "hardware"."sale_items" AS si
    JOIN "hardware"."products" AS p ON p.id = si."productId"
    WHERE si."saleId" = d."saleId"
    ORDER BY p."userId"
    LIMIT 1
  ),
  (SELECT id FROM "hardware"."users" ORDER BY "createdAt" LIMIT 1)
)
WHERE "userId" IS NULL;

UPDATE "hardware"."debt_payments" AS dp
SET "userId" = COALESCE(
  (
    SELECT d."userId"
    FROM "hardware"."debts" AS d
    WHERE d.id = dp."debtId"
    LIMIT 1
  ),
  (SELECT id FROM "hardware"."users" ORDER BY "createdAt" LIMIT 1)
)
WHERE "userId" IS NULL;

UPDATE "hardware"."inventory_transactions" AS it
SET "userId" = COALESCE(
  (
    SELECT p."userId"
    FROM "hardware"."products" AS p
    WHERE p.id = it."productId"
    LIMIT 1
  ),
  (SELECT id FROM "hardware"."users" ORDER BY "createdAt" LIMIT 1)
)
WHERE "userId" IS NULL;

UPDATE "hardware"."reports"
SET "userId" = (SELECT id FROM "hardware"."users" ORDER BY "createdAt" LIMIT 1)
WHERE "userId" IS NULL;

-- Enforce non-null tenant ownership now that data has been backfilled
ALTER TABLE "hardware"."categories" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "hardware"."debt_payments" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "hardware"."debts" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "hardware"."inventory_transactions" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "hardware"."reports" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "hardware"."sales" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "hardware"."categories"("userId", "name");

-- CreateIndex
CREATE INDEX "debt_payments_userId_idx" ON "hardware"."debt_payments"("userId");

-- CreateIndex
CREATE INDEX "debts_userId_idx" ON "hardware"."debts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hardware_lists_userId_name_key" ON "hardware"."hardware_lists"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "hardwares_userId_sku_key" ON "hardware"."hardwares"("userId", "sku");

-- CreateIndex
CREATE INDEX "inventory_transactions_userId_idx" ON "hardware"."inventory_transactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "products_userId_name_key" ON "hardware"."products"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "products_userId_nickname_key" ON "hardware"."products"("userId", "nickname");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "hardware"."reports"("userId");

-- CreateIndex
CREATE INDEX "sales_userId_idx" ON "hardware"."sales"("userId");

-- AddForeignKey
ALTER TABLE "hardware"."categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."sales" ADD CONSTRAINT "sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."debts" ADD CONSTRAINT "debts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."debt_payments" ADD CONSTRAINT "debt_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
