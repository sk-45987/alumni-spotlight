import { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import AlumniPost from '../components/AlumniPost';
import PageHeader from '../components/PageHeader';
import { fetchDraftAccomplishments, updateAccomplishmentStatus } from '../services/accomplishmentService';

const Accomplishments = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDraftPosts();
  }, []);

  const loadDraftPosts = async () => {
    try {
      const data = await fetchDraftAccomplishments();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAction = async (postId, action) => {
    try {
      await updateAccomplishmentStatus(postId, action);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader />
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">
        Recent Alumni Accomplishments
      </h2>
      <div className="max-w-3xl mx-auto" style={{width:'50%'}}>
        <List
          dataSource={posts}
          renderItem={(post) => (
            <AlumniPost 
              post={post} 
              onAction={handlePostAction}
            />
          )}
          locale={{ emptyText: 'No draft accomplishments found' }}
        />
      </div>
    </div>
  );
};

export default Accomplishments;