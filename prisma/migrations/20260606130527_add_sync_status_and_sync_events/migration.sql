/*
  Warnings:

  - You are about to drop the column `packageCount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `packagePrice` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "hardware"."SyncEntityType" AS ENUM ('SALE', 'INVENTORY_TRANSACTION', 'DEBT', 'DEBT_PAYMENT', 'PRODUCT', 'CUSTOMER', 'RECEIPT');

-- CreateEnum
CREATE TYPE "hardware"."SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'FAILED');

-- AlterTable
ALTER TABLE "hardware"."debt_payments" ADD COLUMN     "syncStatus" "hardware"."SyncStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "syncedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "hardware"."debts" ADD COLUMN     "syncStatus" "hardware"."SyncStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "syncedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "hardware"."inventory_transactions" ADD COLUMN     "syncStatus" "hardware"."SyncStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "syncedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "hardware"."products" DROP COLUMN "packageCount",
DROP COLUMN "packagePrice";

-- AlterTable
ALTER TABLE "hardware"."sales" ADD COLUMN     "syncStatus" "hardware"."SyncStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "syncedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "hardware"."sync_events" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "entityType" "hardware"."SyncEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "hardware"."SyncStatus" NOT NULL DEFAULT 'PENDING',
    "lastError" TEXT,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_events_status_idx" ON "hardware"."sync_events"("status");

-- CreateIndex
CREATE INDEX "sync_events_entityType_entityId_idx" ON "hardware"."sync_events"("entityType", "entityId");
