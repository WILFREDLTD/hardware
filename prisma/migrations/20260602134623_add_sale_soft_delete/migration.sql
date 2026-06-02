-- AlterTable
ALTER TABLE "hardware"."sales" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionReason" TEXT;
