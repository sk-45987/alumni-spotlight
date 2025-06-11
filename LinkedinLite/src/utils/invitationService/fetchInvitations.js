import { supabase } from '../supabase';

export async function fetchInvitationsList(userId) {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('invitations')
    .select(`
      id,
      status,
      permissions,
      created_at,
      from_userid,
      to_userid,
      from_user:profiles!invitations_from_userid_fkey(
        id, 
        email, 
        first_name, 
        last_name
      ),
      to_user:profiles!invitations_to_userid_fkey(
        id, 
        email, 
        first_name, 
        last_name
      )
    `)
    .or(`to_userid.eq.${userId},from_userid.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invitations:', error);
    throw new Error('Failed to fetch invitations');
  }

  return data;
}