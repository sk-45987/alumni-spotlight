import { useEffect, useState } from 'react';
import { Card, Empty } from 'antd';
import AccomplishmentCard from '../components/notifications/AccomplishmentCard';
import { fetchPendingAccomplishments } from '../utils/accomplishmentService';

export default function Notifications() {
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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card title="Notifications" loading={loading}>
        {accomplishments.length === 0 ? (
          <Empty description="No pending notifications" />
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
      </Card>
    </div>
  );
}