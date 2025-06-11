/*
  # Add author field to accomplishments table

  1. Changes
    - Add author field to accomplishments table
    - Update trigger function to include author name from profiles
*/

-- Add author field to accomplishments table
ALTER TABLE accomplishments
ADD COLUMN author text;

-- Update trigger function to include author name
CREATE OR REPLACE FUNCTION handle_post_tags()
RETURNS TRIGGER AS $$
DECLARE
  tags TEXT[] := ARRAY['#Entrepreneurship', '#Patent', '#Leadership', '#Speaker'];
  tag TEXT;
  user_name TEXT;
BEGIN
  -- Get author name from profiles
  SELECT 
    CONCAT_WS(' ', first_name, last_name) 
  INTO user_name 
  FROM profiles 
  WHERE id = NEW.user_id;

  -- Check if content contains any of the tags
  FOREACH tag IN ARRAY tags
  LOOP
    IF NEW.content ILIKE '%' || tag || '%' THEN
      -- Insert into accomplishments with author name
      INSERT INTO accomplishments (user_id, content, post_id, author)
      VALUES (NEW.user_id, NEW.content, NEW.id, user_name)
      ON CONFLICT (post_id) 
      DO UPDATE SET author = EXCLUDED.author;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;