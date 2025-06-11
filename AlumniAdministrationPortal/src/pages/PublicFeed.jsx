import { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import FeedPost from '../components/FeedPost';
import PageHeader from '../components/PageHeader';
import { fetchApprovedPosts } from '../services/feedService';

const PublicFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApprovedPosts();
  }, []);

  const loadApprovedPosts = async () => {
    try {
      const data = await fetchApprovedPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching approved posts:', error);
    } finally {
      setLoading(false);
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
        Alumni Public Feed
      </h2>
      <div className="flex justify-center" style={{ width: '50%' }}>
        <div className="w-1/2" >
          <List
            dataSource={posts}
            renderItem={(post) => (
              <FeedPost post={post}  style={{marginTop:'20px'}}/>
            )}
            locale={{ emptyText: 'No approved posts found' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicFeed;