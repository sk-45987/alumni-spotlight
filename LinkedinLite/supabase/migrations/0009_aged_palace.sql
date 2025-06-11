/*
  # Accomplishments Table and Trigger Setup

  1. New Tables
    - `accomplishments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `approval_status` (enum)
      - `created_at` (timestamp)
      - `post_id` (uuid, references posts)

  2. Changes
    - Add trigger on posts table to detect tags and create accomplishments
    
  3. Security
    - Enable RLS on accomplishments table
    - Add policies for authenticated users
*/

-- Create accomplishment status enum
CREATE TYPE accomplishment_status AS ENUM (
  'DRAFT',
  'Request for Adoption',
  'Request denied',
  'Skipped'
);

-- Create accomplishments table
CREATE TABLE IF NOT EXISTS accomplishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  approval_status accomplishment_status DEFAULT 'DRAFT',
  created_at timestamptz DEFAULT now(),
  post_id uuid REFERENCES posts NOT NULL UNIQUE
);

-- Enable RLS
ALTER TABLE accomplishments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own accomplishments"
  ON accomplishments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to check for tags and create accomplishment
CREATE OR REPLACE FUNCTION handle_post_tags()
RETURNS TRIGGER AS $$
DECLARE
  tags TEXT[] := ARRAY['#Entrepreneurship', '#Patent', '#Leadership', '#Speaker'];
  tag TEXT;
BEGIN
  -- Check if content contains any of the tags
  FOREACH tag IN ARRAY tags
  LOOP
    IF NEW.content ILIKE '%' || tag || '%' THEN
      -- Insert into accomplishments
      INSERT INTO accomplishments (user_id, content, post_id)
      VALUES (NEW.user_id, NEW.content, NEW.id)
      ON CONFLICT (post_id) DO NOTHING;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER check_post_tags
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_post_tags();