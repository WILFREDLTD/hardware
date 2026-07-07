-- AlterTable
ALTER TABLE "hardware"."sales" ADD COLUMN     "supplierName" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "supplierNumber" TEXT NOT NULL DEFAULT 'unknown';
