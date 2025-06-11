/*
  # Add approved content column to accomplishments table

  1. Changes
    - Add `approved_content` column to store the approved version of the content
*/

ALTER TABLE accomplishments
ADD COLUMN IF NOT EXISTS approved_content text;