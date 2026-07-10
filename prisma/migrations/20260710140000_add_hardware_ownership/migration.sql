-- Add ownership columns to hardware lists and hardware items
ALTER TABLE "hardware"."hardware_lists"
ADD COLUMN "userId" TEXT;

ALTER TABLE "hardware"."hardwares"
ADD COLUMN "userId" TEXT;

ALTER TABLE "hardware"."products"
ADD COLUMN "userId" TEXT;

-- Backfill existing rows to the first available user so older data remains accessible
UPDATE "hardware"."hardware_lists"
SET "userId" = (
  SELECT "id"
  FROM "hardware"."users"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "userId" IS NULL;

UPDATE "hardware"."hardwares"
SET "userId" = (
  SELECT "id"
  FROM "hardware"."users"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "userId" IS NULL;

UPDATE "hardware"."products"
SET "userId" = (
  SELECT "id"
  FROM "hardware"."users"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "userId" IS NULL;

-- Enforce ownership and add indexes
ALTER TABLE "hardware"."hardware_lists"
ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "hardware"."hardwares"
ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "hardware"."products"
ALTER COLUMN "userId" SET NOT NULL;

CREATE INDEX "hardware_lists_userId_idx"
ON "hardware"."hardware_lists"("userId");

CREATE INDEX "hardwares_userId_idx"
ON "hardware"."hardwares"("userId");

CREATE INDEX "products_userId_idx"
ON "hardware"."products"("userId");

ALTER TABLE "hardware"."hardware_lists"
ADD CONSTRAINT "hardware_lists_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "hardware"."hardwares"
ADD CONSTRAINT "hardwares_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "hardware"."products"
ADD CONSTRAINT "products_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "hardware"."users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
