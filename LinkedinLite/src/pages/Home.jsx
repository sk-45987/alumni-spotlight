import { useState, useEffect } from 'react';
import { Card, Input, Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../utils/supabase';
import UserProfileSidebar from '../components/UserProfileSidebar';
import CommentSection from '../components/CommentSection';

const { TextArea } = Input;

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            email,
            first_name,
            last_name
          ),
          post_likes (
            id,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process likes data
      const likesCount = {};
      const userLikedPosts = {};
      
      data.forEach(post => {
        likesCount[post.id] = post.post_likes?.length || 0;
        userLikedPosts[post.id] = post.post_likes?.some(like => like.user_id === user?.id) || false;
      });

      setPosts(data);
      setLikes(likesCount);
      setUserLikes(userLikedPosts);

      // Fetch comments for all posts
      data.forEach(post => {
        fetchComments(post.id);
      });
    } catch (error) {
      message.error('Error fetching posts');
      console.error(error);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (userLikes[postId]) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        setLikes(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
        setUserLikes(prev => ({ ...prev, [postId]: false }));
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;

        setLikes(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
        setUserLikes(prev => ({ ...prev, [postId]: true }));
      }
    } catch (error) {
      message.error('Error updating like');
      console.error(error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            email,
            first_name,
            last_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [postId]: data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('posts')
        .insert([{ 
          content: newPost,
          user_id: user.id
        }]);

      if (error) throw error;

      setNewPost('');
      fetchPosts();
      message.success('Post created successfully!');
    } catch (error) {
      message.error('Error creating post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <UserProfileSidebar />
        </div>

        <div className="col-span-9">
          <Card className="mb-8">
            <TextArea
              rows={4}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="mb-4"
            />
            <Button
              type="primary"
              onClick={handleSubmitPost}
              loading={loading}
              block
            >
              Post
            </Button>
          </Card>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-sm">
                <div className="mb-2">
                  <span className="font-semibold">
                    {post.profiles?.first_name} {post.profiles?.last_name}
                  </span>
                </div>
                <p className="mb-4">{post.content}</p>
                <div className="flex space-x-4 text-gray-500">
                  <button 
                    className={`flex items-center space-x-1 hover:text-blue-600 ${userLikes[post.id] ? 'text-blue-600' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>Like {likes[post.id] > 0 && `(${likes[post.id]})`}</span>
                  </button>
                  <button 
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => toggleComments(post.id)}
                  >
                    <FontAwesomeIcon icon={faComment} />
                    <span>Comment</span>
                  </button>
                </div>
                {expandedComments[post.id] && (
                  <CommentSection
                    postId={post.id}
                    comments={comments[post.id] || []}
                    onCommentAdded={() => fetchComments(post.id)}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;