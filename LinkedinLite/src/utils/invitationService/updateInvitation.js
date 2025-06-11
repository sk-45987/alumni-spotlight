import { supabase } from '../supabase';
import { addToNetwork } from '../networkService';

export async function updateInvitationStatus(invitationId, status, permissions = null) {
  if (!invitationId) throw new Error('Invitation ID is required');
  if (!status) throw new Error('Status is required');

  const updateData = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (permissions !== null) {
    updateData.permissions = permissions;
  }

  // Get invitation details first
  const { data: invitation, error: fetchError } = await supabase
    .from('invitations')
    .select('from_userid, to_userid')
    .eq('id', invitationId)
    .single();

  if (fetchError) throw fetchError;

  // Update invitation status
  const { error: updateError } = await supabase
    .from('invitations')
    .update(updateData)
    .eq('id', invitationId);

  if (updateError) throw updateError;

  // If accepted, add users to each other's networks
  if (status === 'ACCEPTED') {
    await addToNetwork(invitation.to_userid, invitation.from_userid);
  }
}