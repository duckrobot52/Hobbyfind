-- Add email column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL;
