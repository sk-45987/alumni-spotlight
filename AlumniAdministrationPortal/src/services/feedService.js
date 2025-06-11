import { supabase } from '../supabase/client';

export const fetchApprovedPosts = async () => {
  const { data, error } = await supabase
    .from('accomplishments')
    .select('*')
    .eq('approval_status', 'REQUEST_APPROVED')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};