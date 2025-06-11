/*
  # Fix foreign key relationships for posts and profiles

  1. Changes
    - Copy existing user IDs from auth.users to profiles
    - Update foreign key constraints for posts table
*/

-- First ensure all auth users have corresponding profile entries
INSERT INTO profiles (id, email)
SELECT id, email 
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Now safe to update foreign key constraints
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_user_id_fkey,
ADD CONSTRAINT posts_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES profiles(id);

-- Add foreign key relationship between comments and profiles
ALTER TABLE comments
DROP CONSTRAINT IF EXISTS comments_user_id_fkey,
ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES profiles(id);