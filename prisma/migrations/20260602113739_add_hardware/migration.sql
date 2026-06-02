-- CreateTable
CREATE TABLE "hardware_lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hardware_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardwares" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "listId" TEXT,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hardwares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hardwares_sku_key" ON "hardwares"("sku");

-- CreateIndex
CREATE INDEX "hardwares_sku_idx" ON "hardwares"("sku");

-- CreateIndex
CREATE INDEX "hardwares_listId_idx" ON "hardwares"("listId");

-- AddForeignKey
ALTER TABLE "hardwares" ADD CONSTRAINT "hardwares_listId_fkey" FOREIGN KEY ("listId") REFERENCES "hardware_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
