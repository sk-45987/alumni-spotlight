import { useState } from 'react';
import { Card } from 'antd';
import SendInvitation from '../components/SendInvitation';
import InvitationList from '../components/InvitationList';

function Network() {
  const [key, setKey] = useState(0);

  const handleUpdate = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card title="Send Network Invitation" className="mb-8">
        <SendInvitation onInvitationSent={handleUpdate} />
      </Card>
      
      <Card title="Network Invitations">
        <InvitationList key={key} onUpdate={handleUpdate} />
      </Card>
    </div>
  );
}

export default Network;