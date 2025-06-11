import { useState } from 'react';
import { Card, Button, Divider } from 'antd';
import InvitationPermission from './InvitationPermission';

export default function InvitationCard({ invitation, onAccept, onReject }) {
  const [permissions, setPermissions] = useState(invitation.permissions || []);

  const handlePermissionToggle = (permission, enabled) => {
    setPermissions(prev => 
      enabled 
        ? [...prev, permission]
        : prev.filter(p => p !== permission)
    );
  };

  const handleAccept = () => {
    onAccept(invitation.id, permissions);
  };

  const allPermissions = [
    'POST_VISIBILITY',
    'EMPLOYER_LOCATION_VISIBILITY',
  ];

  const getFullName = (user) => {
    if (!user) return '';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName} ${lastName}`.trim() || user.email;
  };

  return (
    <Card className="mb-4">
      <p className="text-lg mb-4">
        <span className="font-semibold">{getFullName(invitation.from_user)}</span> would like to join your network
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Please review the information you would like to share
      </p>
      
      <Divider />
      
      <div className="space-y-2">
        {allPermissions.map(permission => (
          <InvitationPermission
            key={permission}
            permission={permission}
            enabled={permissions.includes(permission)}
            onChange={handlePermissionToggle}
          />
        ))}
      </div>

      <Divider />

      <div className="flex justify-end space-x-4">
        <Button danger onClick={() => onReject(invitation.id)}>
          Reject
        </Button>
        <Button type="primary" onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </Card>
  );
}