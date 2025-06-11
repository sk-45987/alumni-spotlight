/*
  # Update accomplishments table schema

  1. Changes
    - Rename 'status' column to 'approval_status' to match existing database structure
    - Update RLS policies to use new column name

  2. Security
    - Maintain existing RLS policies with updated column name
*/

-- First, check if we need to rename the column
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'accomplishments' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE accomplishments RENAME COLUMN status TO approval_status;
  END IF;
END $$;

-- Update the RLS policy to use the new column name
DROP POLICY IF EXISTS "Anyone can read accomplishments" ON accomplishments;

CREATE POLICY "Anyone can read accomplishments"
  ON accomplishments
  FOR SELECT
  TO authenticated
  USING (true);