/*
  # Update accomplishments table policies

  1. Changes
    - Add policy for users to update their own accomplishments
    - Add policy for users to insert accomplishments
  
  2. Security
    - Enable RLS
    - Restrict updates to own accomplishments
    - Allow authenticated users to create accomplishments
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update their own accomplishments" ON accomplishments;
DROP POLICY IF EXISTS "Users can insert accomplishments" ON accomplishments;

-- Create new policies
CREATE POLICY "Users can update their own accomplishments"
  ON accomplishments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert accomplishments"
  ON accomplishments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);