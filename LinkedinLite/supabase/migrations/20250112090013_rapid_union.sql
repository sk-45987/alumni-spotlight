-- Create employer_history table to track changes
CREATE TABLE IF NOT EXISTS employer_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  employer text NOT NULL,
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employer_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own employer history"
  ON employer_history FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own employer history"
  ON employer_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

-- Create trigger to track employer changes
CREATE OR REPLACE FUNCTION track_employer_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.employer != NEW.employer) THEN
    INSERT INTO employer_history (profile_id, employer)
    VALUES (NEW.id, NEW.employer);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_employer_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_employer_changes();