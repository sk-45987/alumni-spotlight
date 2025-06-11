-- Add employer column to profiles table with default value
ALTER TABLE profiles 
ADD COLUMN employer text NOT NULL DEFAULT 'LinkedIn';

-- Update existing rows to have LinkedIn as employer
UPDATE profiles SET employer = 'LinkedIn' WHERE employer IS NULL;