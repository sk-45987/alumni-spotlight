/*
  # Move location fields to profiles table and add history tracking
  
  1. Changes
    - Add country and city columns to profiles table
    - Create location_history table
    - Migrate data from profile_locations
    - Drop profile_locations table
    
  2. New Tables
    - location_history: Tracks changes to location information
      - id (uuid, primary key)
      - profile_id (uuid, references profiles)
      - country (text)
      - city (text)
      - changed_at (timestamptz)
*/

-- Add location columns to profiles table
ALTER TABLE profiles 
ADD COLUMN country text NOT NULL DEFAULT 'USA',
ADD COLUMN city text NOT NULL DEFAULT 'Sunnyvale';

-- Create location_history table
CREATE TABLE IF NOT EXISTS location_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own location history"
  ON location_history FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own location history"
  ON location_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

-- Migrate existing data from profile_locations
UPDATE profiles p
SET 
  country = pl.country,
  city = pl.city
FROM profile_locations pl
WHERE p.id = pl.profile_id;

-- Create trigger for location history
CREATE OR REPLACE FUNCTION track_location_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND (OLD.country != NEW.country OR OLD.city != NEW.city)) THEN
    INSERT INTO location_history (profile_id, country, city)
    VALUES (NEW.id, NEW.country, NEW.city);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_location_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_location_changes();

-- Drop profile_locations table
DROP TABLE profile_locations;