import { supabase } from '../supabase/client';

export async function fetchRecentLocationChanges() {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('location_history')
      .select(`
        id,
        city,
        country,
        changed_at,
        profile_id,
        profiles (
          first_name,
          last_name,
          email
        )
      `)
      .gte('changed_at', yesterday)
      .order('changed_at', { ascending: false });

    if (error) throw error;

    // Filter to keep only the latest entry per profile
    const latestPerProfile = data?.reduce((acc, current) => {
      if (!acc[current.profile_id] || 
          new Date(current.changed_at) > new Date(acc[current.profile_id].changed_at)) {
        acc[current.profile_id] = current;
      }
      return acc;
    }, {});

    // Convert back to array and sort by changed_at
    const result = Object.values(latestPerProfile).sort((a, b) => 
      new Date(b.changed_at) - new Date(a.changed_at)
    );

    return result || [];
  } catch (error) {
    console.error('Error fetching location changes:', error);
    throw error;
  }
}