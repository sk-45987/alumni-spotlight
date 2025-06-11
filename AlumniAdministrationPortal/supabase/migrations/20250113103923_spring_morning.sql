/*
  # Add reactions support for comments

  1. New Tables
    - `reactions`
      - `id` (uuid, primary key)
      - `comment_id` (uuid, references comments)
      - `user_id` (uuid)
      - `emoji` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reactions` table
    - Add policy for authenticated users to manage their reactions
*/

CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reactions"
  ON reactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view reactions"
  ON reactions
  FOR SELECT
  TO authenticated
  USING (true);