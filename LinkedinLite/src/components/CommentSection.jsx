import { useState } from 'react';
import { Input, Button, List, Avatar, Popover, message } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { SmileOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';

const { TextArea } = Input;

export default function CommentSection({ postId, comments, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content
        });

      if (error) throw error;

      setContent('');
      onCommentAdded();
      message.success('Comment added successfully');
    } catch (error) {
      message.error('Failed to add comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      onCommentAdded();
      message.success('Comment deleted successfully');
    } catch (error) {
      message.error('Failed to delete comment');
    }
  };

  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="mt-4">
      <div className="flex space-x-2 mb-4">
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="flex-1"
        />
        <Popover
          content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
          trigger="click"
          open={showEmojiPicker}
          onOpenChange={setShowEmojiPicker}
        >
          <Button icon={<SmileOutlined />} />
        </Popover>
        <Button type="primary" onClick={handleSubmit}>
          Post
        </Button>
      </div>

      {comments.length > 0 && (
        <List
          className="mt-4"
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={comment => (
            <List.Item
              actions={[
                user?.id === comment.user_id && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(comment.id)}
                  />
                )
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar>
                    {comment.profiles?.first_name?.[0] || comment.profiles?.email?.[0] || '?'}
                  </Avatar>
                }
                title={`${comment.profiles?.first_name || ''} ${comment.profiles?.last_name || ''}`}
                description={<p className="whitespace-pre-wrap">{comment.content}</p>}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}