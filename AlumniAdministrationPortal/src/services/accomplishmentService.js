import { supabase } from '../supabase/client';
import { AccomplishmentStatus } from '../constants/accomplishmentStatus';

export const fetchDraftAccomplishments = async () => {
  try {
    const { data, error } = await supabase
      .from('accomplishments')
      .select('*')
      .eq('approval_status', 'DRAFT')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to fetch accomplishments. Please try again later.');
  }
};

export const updateAccomplishmentStatus = async (postId, action) => {
  try {
    let status;
    switch (action) {
      case 'skip':
        status = AccomplishmentStatus.SKIPPED;
        break;
      case 'request':
        status = AccomplishmentStatus.REQUEST_FOR_ADOPTION;
        break;
      default:
        throw new Error('Invalid action');
    }

    const { error } = await supabase
      .from('accomplishments')
      .update({ approval_status: status })
      .eq('id', postId);

    if (error) throw error;
  } catch (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to update accomplishment status. Please try again later.');
  }
};