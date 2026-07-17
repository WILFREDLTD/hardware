-- CreateTable
CREATE TABLE "hardware"."suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_userId_name_key" ON "hardware"."suppliers"("userId", "name");

-- AddForeignKey
ALTER TABLE "hardware"."suppliers" ADD CONSTRAINT "suppliers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
