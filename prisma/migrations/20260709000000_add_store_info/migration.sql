-- AlterTable
ALTER TABLE "hardware"."users" ADD COLUMN "storeName" TEXT DEFAULT 'My Hardware Store',
ADD COLUMN "storeLocation" TEXT,
ADD COLUMN "storeDescription" TEXT;
