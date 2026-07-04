-- Enable Row Level Security for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 1. Hobbies Table Policies (Public Read-Only)
DROP POLICY IF EXISTS "Allow public read access to hobbies" ON hobbies;
CREATE POLICY "Allow public read access to hobbies"
ON hobbies FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Users Table Policies (Strictly Restrict direct access)
-- Users data is only managed via the Next.js backend API (service_role), bypassing RLS securely.
-- No anon/authenticated direct access to other user rows.
DROP POLICY IF EXISTS "Restrict users access to service_role" ON users;
CREATE POLICY "Restrict users access to service_role"
ON users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Bookmarks Table Policies
-- Bookmarks are read and modified via service_role in backend API endpoints.
-- Direct client access is disallowed for security constraints.
DROP POLICY IF EXISTS "Restrict bookmarks access to service_role" ON bookmarks;
CREATE POLICY "Restrict bookmarks access to service_role"
ON bookmarks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
