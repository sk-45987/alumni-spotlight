/*
  # Add network management function

  1. New Functions
    - add_to_network: Adds users to each other's networks
*/

-- Function to add users to each other's networks
CREATE OR REPLACE FUNCTION add_to_network(target_user_id uuid, network_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add network_user_id to target_user_id's network
  UPDATE profiles 
  SET network = array_append(COALESCE(network, ARRAY[]::uuid[]), network_user_id)
  WHERE id = target_user_id
  AND NOT (network_user_id = ANY(COALESCE(network, ARRAY[]::uuid[])));

  -- Add target_user_id to network_user_id's network
  UPDATE profiles 
  SET network = array_append(COALESCE(network, ARRAY[]::uuid[]), target_user_id)
  WHERE id = network_user_id
  AND NOT (target_user_id = ANY(COALESCE(network, ARRAY[]::uuid[])));
END;
$$;