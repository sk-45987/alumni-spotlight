/*
  # Add employer and employer history tables

  1. New Tables
    - `employers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `logo_url` (text)
      - `created_at` (timestamp)
    - `employer_history`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key to profiles)
      - `employer_id` (uuid, foreign key to employers)
      - `changed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data
*/

-- Create employers table
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create employer_history table with foreign key relationships
CREATE TABLE IF NOT EXISTS employer_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  employer_id uuid REFERENCES employers(id) ON DELETE SET NULL,
  changed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can read employers"
  ON employers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read employer history"
  ON employer_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employer_history_profile_id ON employer_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_employer_history_employer_id ON employer_history(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_history_changed_at ON employer_history(changed_at);