import { supabase } from '../supabase';

export async function sendInvitation(toEmail) {
  if (!toEmail) throw new Error('Email is required');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to send invitations');

  // Get the target user's profile
  const { data: toUserProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', toEmail)
    .single();

  if (profileError || !toUserProfile) {
    throw new Error('User not found');
  }

  if (toUserProfile.id === user.id) {
    throw new Error('You cannot send an invitation to yourself');
  }

  // Check if invitation already exists - using maybeSingle() instead of single()
  const { data: existingInvitation, error: checkError } = await supabase
    .from('invitations')
    .select('id, status')
    .or(`and(from_userid.eq.${user.id},to_userid.eq.${toUserProfile.id}),and(from_userid.eq.${toUserProfile.id},to_userid.eq.${user.id})`)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking existing invitation:', checkError);
    throw new Error('Failed to check existing invitation');
  }

  if (existingInvitation) {
    if (existingInvitation.status === 'ACTIVE') {
      throw new Error('An invitation is already pending');
    } else if (existingInvitation.status === 'ACCEPTED') {
      throw new Error('You are already connected with this user');
    }
  }

  // Send new invitation
  const { error: insertError } = await supabase
    .from('invitations')
    .insert({
      from_userid: user.id,
      to_userid: toUserProfile.id,
      status: 'ACTIVE',
      permissions: ['POST_VISIBILITY', 'EMPLOYER_LOCATION_VISIBILITY']
    });

  if (insertError) {
    console.error('Error sending invitation:', insertError);
    throw new Error('Failed to send invitation');
  }
}