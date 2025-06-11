import { useState } from 'react';
import { Card, Button, message, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { updateAccomplishmentStatus } from '../../utils/accomplishmentService';
import { simplifyContent } from '../../utils/openai';
import ContentSlider from './ContentSlider';

export default function AccomplishmentCard({ accomplishment, onStatusUpdate }) {
  const [selectedVersion, setSelectedVersion] = useState('original');
  const [simplifiedContent, setSimplifiedContent] = useState(null);
  const [minimalContent, setMinimalContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVersionChange = async (version) => {
    if (version === 'original') {
      setSelectedVersion(version);
      return;
    }

    if ((version === 'simplified' && !simplifiedContent) || 
        (version === 'minimal' && !minimalContent)) {
      setLoading(true);
      try {
        const content = await simplifyContent(accomplishment.content, version);
        if (version === 'simplified') {
          setSimplifiedContent(content);
        } else {
          setMinimalContent(content);
        }
      } catch (error) {
        message.error('Failed to simplify content');
        return;
      } finally {
        setLoading(false);
      }
    }
    
    setSelectedVersion(version);
  };

  const handleStatusChange = async (status) => {
    try {
      const contentToUse = selectedVersion === 'original' 
        ? accomplishment.content 
        : selectedVersion === 'simplified'
          ? simplifiedContent
          : minimalContent;

      await updateAccomplishmentStatus(accomplishment.id, status, contentToUse);
      message.success('Status updated successfully');
      onStatusUpdate(accomplishment.id);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const displayContent = selectedVersion === 'original' 
    ? accomplishment.content 
    : selectedVersion === 'simplified'
      ? simplifiedContent
      : minimalContent;

  return (
    <Card className="shadow-sm">
      <div className="space-y-4">
        <p className="text-gray-600">
          <strong>Your Alma matter wants to add your achievement to Alumni Achievement Feed. Proceed further?</strong>
        </p>
        
        <ContentSlider value={selectedVersion} onChange={handleVersionChange} />
        
        <div>
          <p className="font-semibold">{accomplishment.author}</p>
          <Spin spinning={loading}>
            <p className="text-gray-600 text-sm min-h-[3rem]">
              {displayContent || accomplishment.content}
            </p>
          </Spin>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            type="primary"
            onClick={() => handleStatusChange('REQUEST_APPROVED')}
            icon={<FontAwesomeIcon icon={faThumbsUp} className="mr-2" />}
          >
            Allow to be showcased publicly
          </Button>
          <Button
            danger
            onClick={() => handleStatusChange('REQUEST_DENIED')}
            icon={<FontAwesomeIcon icon={faThumbsDown} />}
          />
        </div>
      </div>
    </Card>
  );
}