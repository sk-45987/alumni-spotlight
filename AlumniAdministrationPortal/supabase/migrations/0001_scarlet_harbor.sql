/*
  # Create accomplishments table

  1. New Tables
    - `accomplishments`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author` (text)
      - `status` (text) - can be 'draft', 'approved', or 'rejected'
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `accomplishments` table
    - Add policy for authenticated users to read accomplishments
*/

CREATE TABLE IF NOT EXISTS accomplishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accomplishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read accomplishments"
  ON accomplishments
  FOR SELECT
  TO authenticated
  USING (true);