-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at column to users table and attach trigger
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at column to hobbies table and attach trigger
ALTER TABLE hobbies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
DROP TRIGGER IF EXISTS set_hobbies_updated_at ON hobbies;
CREATE TRIGGER set_hobbies_updated_at
    BEFORE UPDATE ON hobbies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at column to bookmarks table and attach trigger
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
DROP TRIGGER IF EXISTS set_bookmarks_updated_at ON bookmarks;
CREATE TRIGGER set_bookmarks_updated_at
    BEFORE UPDATE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
