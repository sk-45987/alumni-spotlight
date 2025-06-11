import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function PermissionTooltip({ permission }) {
  const getTooltipContent = () => {
    switch (permission) {
      case 'POST_VISIBILITY':
        return 'This permission allows the user to see your posts in their feed and interact with them. They can like, comment, and share your posts within the network.';
      case 'EMPLOYER_LOCATION_VISIBILITY':
        return 'Sharing employer information helps connect with professionals in similar industries or locations. This includes your current employer name and office location.';
      case 'EMPLOYEE_HOME_ZIPCODE_VISIBILITY':
        return 'Your postal code is used to connect with nearby professionals and alumni. It helps in organizing local meetups and professional events.';
      default:
        return '';
    }
  };

  return (
    <Tooltip title={getTooltipContent()}>
      <InfoCircleOutlined className="text-gray-400 ml-2 cursor-help" />
    </Tooltip>
  );
}