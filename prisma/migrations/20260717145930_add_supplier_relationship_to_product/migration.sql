-- AlterTable
ALTER TABLE "hardware"."products" ADD COLUMN     "supplierId" TEXT;

-- CreateIndex
CREATE INDEX "products_supplierId_idx" ON "hardware"."products"("supplierId");

-- AddForeignKey
ALTER TABLE "hardware"."products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "hardware"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
