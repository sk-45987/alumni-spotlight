import { useState, useEffect } from 'react';
import { List, Empty, message } from 'antd';
import { useAuth } from '../hooks/useAuth';
import { fetchInvitationsList, updateInvitationStatus } from '../utils/invitationService';
import InvitationCard from './InvitationCard';

export default function InvitationList({ onUpdate }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    try {
      const data = await fetchInvitationsList(user.id);
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      message.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId, permissions) => {
    try {
      await updateInvitationStatus(invitationId, 'ACCEPTED', permissions);
      message.success('Invitation accepted');
      await loadInvitations();
      onUpdate?.();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      message.error('Failed to accept invitation');
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await updateInvitationStatus(invitationId, 'REJECTED');
      message.success('Invitation rejected');
      await loadInvitations();
      onUpdate?.();
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      message.error('Failed to reject invitation');
    }
  };

  if (!loading && invitations.length === 0) {
    return <Empty description="No invitations found" />;
  }

  return (
    <List
      loading={loading}
      dataSource={invitations.filter(inv => inv.status === 'ACTIVE' && inv.to_userid === user?.id)}
      renderItem={(invitation) => (
        <InvitationCard
          invitation={invitation}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    />
  );
}