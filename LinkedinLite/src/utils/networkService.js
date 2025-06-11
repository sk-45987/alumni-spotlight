import { supabase } from './supabase';

export async function addToNetwork(userId, networkUserId) {
  try {
    const { error } = await supabase.rpc('add_to_network', {
      target_user_id: userId,
      network_user_id: networkUserId
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding to network:', error);
    throw new Error('Failed to add user to network');
  }
}