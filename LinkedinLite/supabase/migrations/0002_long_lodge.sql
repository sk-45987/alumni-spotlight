-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for users based on user_id"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete access for users based on user_id"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);