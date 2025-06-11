import { supabase } from './supabase';

export const updateUserProfile = async (userId, data) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      employer: data.employer,
      country: data.country,
      city: data.city
    })
    .eq('id', userId);

  if (error) throw error;
};

export const getUserProfile = async (userId) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return profile;
};