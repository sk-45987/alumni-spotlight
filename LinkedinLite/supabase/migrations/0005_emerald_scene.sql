/*
  # Add foreign key relationships for invitations table

  1. Changes
    - Add foreign key constraints between invitations and profiles tables
    - Update existing foreign key references to point to profiles instead of auth.users
    
  2. Security
    - Maintains existing RLS policies
*/

-- First, update the invitations table to reference profiles instead of auth.users
ALTER TABLE invitations 
  DROP CONSTRAINT invitations_from_userid_fkey,
  DROP CONSTRAINT invitations_to_userid_fkey;

ALTER TABLE invitations
  ADD CONSTRAINT invitations_from_userid_fkey 
    FOREIGN KEY (from_userid) 
    REFERENCES profiles(id),
  ADD CONSTRAINT invitations_to_userid_fkey 
    FOREIGN KEY (to_userid) 
    REFERENCES profiles(id);