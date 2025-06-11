import { supabase } from './supabase';

export async function fetchPendingAccomplishments() {
  const { data, error } = await supabase
    .from('accomplishments')
    .select('*')
    .eq('approval_status', 'REQUEST_FOR_ADOPTION')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateAccomplishmentStatus(id, status, content = null) {
  const updateData = { 
    approval_status: status,
    approved_content: content // Save the selected version of content
  };

  const { error } = await supabase
    .from('accomplishments')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}