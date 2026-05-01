-- Migration: swap password_hash → clerk_id, add email, make phone/location optional
-- Drop old constraints
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_phone_unique";

-- Drop old columns
ALTER TABLE "users" DROP COLUMN IF EXISTS "password_hash";

-- Add new columns
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "clerk_id" varchar(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" varchar(255);

-- Backfill if any rows exist (in fresh DB there are none)
-- Update NOT NULL after backfill
ALTER TABLE "users" ALTER COLUMN "clerk_id" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;

-- Make phone and location optional
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "location" DROP NOT NULL;

-- Add unique constraints
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
