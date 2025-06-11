/*
  # Add location information table

  1. New Tables
    - `profile_locations`
      - `profile_id` (uuid, primary key, foreign key to profiles)
      - `country` (text, default 'USA')
      - `city` (text, default 'Sunnyvale')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `profile_locations` table
    - Add policies for authenticated users
*/

-- Create profile_locations table
CREATE TABLE IF NOT EXISTS profile_locations (
  profile_id uuid PRIMARY KEY REFERENCES profiles(id),
  country text NOT NULL DEFAULT 'USA',
  city text NOT NULL DEFAULT 'Sunnyvale',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profile_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view any profile location"
  ON profile_locations FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own location"
  ON profile_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own location"
  ON profile_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_profile_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_locations_updated_at
  BEFORE UPDATE ON profile_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_locations_updated_at();

-- Modify handle_new_user function to also create location entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (new.id, new.email, '', '');
  
  -- Insert into profile_locations with defaults
  INSERT INTO public.profile_locations (profile_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;