-- Create categories table
CREATE SCHEMA IF NOT EXISTS "hardware";

CREATE TABLE IF NOT EXISTS "hardware"."categories" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
