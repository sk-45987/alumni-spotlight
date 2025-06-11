import { Card, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const FeedPost = ({ post }) => {
  const isSpeaker = post.approved_content.includes('#Speaker');
  const displayContent = post.approved_content.replace('#Speaker', '').trim();

  return (
    <Card className="my-5 hover:shadow-lg transition-shadow w-full">
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
          <p className="text-sm text-gray-500">
            <strong>
            {isSpeaker 
              ? `${post.author} - (class of 2015) spoke about ${displayContent}`
              : `Posted by: ${post.author} (class of 2015)`
            }</strong>
          </p>
          <h4 className="text-lg font-semibold text-primary">{post.title}</h4>
          {!isSpeaker && <p className="text-gray-600 my-2">{displayContent}</p>}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeedPost;