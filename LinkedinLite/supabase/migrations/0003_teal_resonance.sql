/*
  # Create invitations table and policies

  1. New Tables
    - `invitations`
      - `id` (uuid, primary key)
      - `from_userid` (uuid, references auth.users)
      - `to_userid` (uuid, references auth.users)
      - `status` (enum: ACCEPTED, ACTIVE, REJECTED)
      - `permissions` (text array with default values)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for create, read, update
*/

-- Create enum type for invitation status
CREATE TYPE invitation_status AS ENUM ('ACCEPTED', 'ACTIVE', 'REJECTED');

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    from_userid uuid REFERENCES auth.users NOT NULL,
    to_userid uuid REFERENCES auth.users NOT NULL,
    status invitation_status DEFAULT 'ACTIVE',
    permissions text[] DEFAULT ARRAY['POST_VISIBILITY', 'EMPLOYER_LOCATION_VISIBILITY', 'EMPLOYEE_HOME_ZIPCODE_VISIBILITY'],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(from_userid, to_userid)
);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create invitations"
    ON invitations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = from_userid);

CREATE POLICY "Users can see invitations they sent or received"
    ON invitations FOR SELECT
    TO authenticated
    USING (auth.uid() = from_userid OR auth.uid() = to_userid);

CREATE POLICY "Users can update invitations they received"
    ON invitations FOR UPDATE
    TO authenticated
    USING (auth.uid() = to_userid)
    WITH CHECK (auth.uid() = to_userid);