import { Card, Button, message, Avatar, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faUser, faComment } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { updateAccomplishmentStatus } from '../services/accomplishmentService';
import { fetchComments, addComment } from '../services/commentService';

const { TextArea } = Input;

const AlumniPost = ({ post, onAction }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, post.id]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(post.id);
      setComments(data);
    } catch (error) {
      message.error('Failed to load comments');
    }
  };

  const handlePermissionRequest = async () => {
    try {
      await updateAccomplishmentStatus(post.id, 'request');
      message.success('Permission request sent');
      onAction(post.id, 'request');
    } catch (error) {
      message.error('Failed to send permission request');
    }
  };

  const handleSkip = () => {
    onAction(post.id, 'skip');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await addComment(post.post_id, newComment.trim());
      message.success('Comment added successfully');
      setNewComment('');
      loadComments();
    } catch (error) {
      message.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Avatar 
            size={64} 
            icon={<FontAwesomeIcon icon={faUser} />}
            className="bg-primary text-white"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=1a365d&color=fff`}
          />
        </div>
        <div className="flex-grow">
          <div>
            <p className="text-sm text-gray-500 mt-2">Posted by: {post.author}</p>
            <h4 className="text-lg font-semibold">{post.title}</h4>
            <p className="text-gray-600">{post.content}</p>
          </div>

          <div className="mt-4 border-t pt-4">
            <Button 
              type="text" 
              icon={<FontAwesomeIcon icon={faComment} />}
              onClick={() => setShowComments(!showComments)}
              className="text-gray-600 hover:text-primary"
            >
              {showComments ? 'Hide Comments' : 'Add Comments'} ({comments.length})
            </Button>

            {showComments && (
              <div className="mt-4">
                <div className="space-y-4 mb-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <TextArea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    className="flex-grow"
                  />
                  <Button
                    type="primary"
                    onClick={handleAddComment}
                    loading={loading}
                    style={{marginTop:'2%'}}
                    className="self-start"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-6 mt-4" style={{marginTop:'5%'}}>
              <Button 
                type="primary"
                className="gap-2"
                style={{marginRight:'2%'}}
                onClick={handlePermissionRequest}
                icon={<FontAwesomeIcon icon={faCheck} />}
              >
                Request Permission to showcase Pubicly
              </Button>
              <Button 
                onClick={handleSkip}
                icon={<FontAwesomeIcon icon={faTimes} />}
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniPost;