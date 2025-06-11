import { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import { supabase } from '../supabase/client';

const DraftAccomplishments = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkDrafts = async () => {
      try {
        const { data, error } = await supabase
          .from('accomplishments')
          .select('*')
        
        
        if (error) throw error;
        setDrafts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkDrafts();
  }, []);

  if (loading) return <Spin />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Draft Accomplishments</h2>
      {drafts.length === 0 ? (
        <p>No draft accomplishments found</p>
      ) : (
        <List
          dataSource={drafts}
          renderItem={(item) => (
            <List.Item>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
                <p className="text-gray-600">{item.approval_status}</p>
                <p className="text-sm text-gray-500">By: {item.author}</p>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default DraftAccomplishments;