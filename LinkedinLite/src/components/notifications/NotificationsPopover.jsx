import { useEffect, useState } from 'react';
import { Card, Empty } from 'antd';
import AccomplishmentCard from './AccomplishmentCard';
import { fetchPendingAccomplishments } from '../../utils/accomplishmentService';

export default function NotificationsPopover({ onClose }) {
  const [accomplishments, setAccomplishments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccomplishments();
  }, []);

  const loadAccomplishments = async () => {
    try {
      const data = await fetchPendingAccomplishments();
      setAccomplishments(data);
    } catch (error) {
      console.error('Error loading accomplishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (accomplishmentId) => {
    setAccomplishments(prev => 
      prev.filter(acc => acc.id !== accomplishmentId)
    );
  };

  return (
    <Card className="shadow-lg" loading={loading}>
      <div className="max-h-96 overflow-y-auto">
        {accomplishments.length === 0 ? (
          <Empty description="No pending accomplishments" />
        ) : (
          <div className="space-y-4">
            {accomplishments.map(accomplishment => (
              <AccomplishmentCard
                key={accomplishment.id}
                accomplishment={accomplishment}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}