/*
  # Add missing location entries for existing profiles

  1. Changes
    - Insert location entries for any existing profiles that don't have one
    - Uses default values (USA for country, Sunnyvale for city)
  
  2. Security
    - No security changes needed as this is a one-time migration
*/

-- Insert missing location entries for existing profiles
INSERT INTO profile_locations (profile_id)
SELECT id FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM profile_locations pl 
  WHERE pl.profile_id = p.id
);