-- AlterTable
ALTER TABLE "hardware"."products" ADD COLUMN     "baseUnit" TEXT NOT NULL DEFAULT 'pcs',
ADD COLUMN     "packageCount" INTEGER,
ADD COLUMN     "packagePrice" DOUBLE PRECISION,
ADD COLUMN     "packageSize" INTEGER,
ADD COLUMN     "packageUnitLabel" TEXT;
