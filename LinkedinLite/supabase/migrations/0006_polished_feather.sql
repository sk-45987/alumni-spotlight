/*
  # Add network column to profiles

  1. Changes
    - Add `network` column to profiles table to store network connections
    - Update RLS policies to allow users to view their own network

  2. Security
    - Maintain existing RLS policies
    - Add specific policy for network visibility
*/

-- Add network column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS network uuid[] DEFAULT ARRAY[]::uuid[];

-- Create index for network column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_network ON profiles USING GIN(network);

-- Update RLS policy for network visibility
CREATE POLICY "Users can view profiles in their network"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    auth.uid() = ANY(network)
  );