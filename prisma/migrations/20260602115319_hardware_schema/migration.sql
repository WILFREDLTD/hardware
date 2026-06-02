-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "hardware";

-- CreateEnum
CREATE TYPE "hardware"."TransactionType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "hardware"."PaymentStatus" AS ENUM ('PAID', 'DEBT');

-- CreateEnum
CREATE TYPE "hardware"."DebtStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "hardware"."ReportType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "hardware"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "minStockLevel" INTEGER NOT NULL DEFAULT 5,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."inventory_transactions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "hardware"."TransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."sales" (
    "id" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "hardware"."PaymentStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."sale_items" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."debts" (
    "id" TEXT NOT NULL,
    "saleId" TEXT,
    "debtorName" TEXT NOT NULL,
    "debtorPhone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "status" "hardware"."DebtStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."debt_payments" (
    "id" TEXT NOT NULL,
    "debtId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "debt_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."reports" (
    "id" TEXT NOT NULL,
    "type" "hardware"."ReportType" NOT NULL,
    "period" TEXT NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "totalDebts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debtsCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debtsPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bestSellers" JSONB,
    "data" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."hardware_lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hardware_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware"."hardwares" (
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
CREATE UNIQUE INDEX "users_email_key" ON "hardware"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "hardware"."products"("sku");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "hardware"."products"("category");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "hardware"."products"("sku");

-- CreateIndex
CREATE INDEX "inventory_transactions_productId_idx" ON "hardware"."inventory_transactions"("productId");

-- CreateIndex
CREATE INDEX "inventory_transactions_date_idx" ON "hardware"."inventory_transactions"("date");

-- CreateIndex
CREATE INDEX "sales_saleDate_idx" ON "hardware"."sales"("saleDate");

-- CreateIndex
CREATE INDEX "sales_paymentStatus_idx" ON "hardware"."sales"("paymentStatus");

-- CreateIndex
CREATE INDEX "sale_items_saleId_idx" ON "hardware"."sale_items"("saleId");

-- CreateIndex
CREATE INDEX "sale_items_productId_idx" ON "hardware"."sale_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "debts_saleId_key" ON "hardware"."debts"("saleId");

-- CreateIndex
CREATE INDEX "debts_status_idx" ON "hardware"."debts"("status");

-- CreateIndex
CREATE INDEX "debts_date_idx" ON "hardware"."debts"("date");

-- CreateIndex
CREATE INDEX "debts_debtorPhone_idx" ON "hardware"."debts"("debtorPhone");

-- CreateIndex
CREATE INDEX "debt_payments_debtId_idx" ON "hardware"."debt_payments"("debtId");

-- CreateIndex
CREATE INDEX "debt_payments_date_idx" ON "hardware"."debt_payments"("date");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "hardware"."reports"("type");

-- CreateIndex
CREATE INDEX "reports_period_idx" ON "hardware"."reports"("period");

-- CreateIndex
CREATE UNIQUE INDEX "hardwares_sku_key" ON "hardware"."hardwares"("sku");

-- CreateIndex
CREATE INDEX "hardwares_sku_idx" ON "hardware"."hardwares"("sku");

-- CreateIndex
CREATE INDEX "hardwares_listId_idx" ON "hardware"."hardwares"("listId");

-- AddForeignKey
ALTER TABLE "hardware"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "hardware"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."sale_items" ADD CONSTRAINT "sale_items_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "hardware"."sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."sale_items" ADD CONSTRAINT "sale_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "hardware"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."debts" ADD CONSTRAINT "debts_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "hardware"."sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."debt_payments" ADD CONSTRAINT "debt_payments_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "hardware"."debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardware"."hardwares" ADD CONSTRAINT "hardwares_listId_fkey" FOREIGN KEY ("listId") REFERENCES "hardware"."hardware_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
