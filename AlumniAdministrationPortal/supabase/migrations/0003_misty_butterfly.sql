/*
  # Update approval status values
  
  1. Changes
    - Convert existing approval_status values to uppercase
*/

-- Update existing data to use uppercase status values
UPDATE accomplishments 
SET approval_status = UPPER(approval_status)
WHERE approval_status IS NOT NULL;