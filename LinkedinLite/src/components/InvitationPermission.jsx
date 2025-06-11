import { Switch } from 'antd';
import PermissionTooltip from './PermissionTooltip';

export default function InvitationPermission({ permission, enabled, onChange }) {
  const getPermissionDetails = () => {
    switch (permission) {
      case 'POST_VISIBILITY':
        return {
          title: 'Posts Activity',
          description: 'Can see your posts activity'
        };
      case 'EMPLOYER_LOCATION_VISIBILITY':
        return {
          title: 'Employer Information',
          description: 'Can see your employer information like employer name, location etc'
        };
      case 'EMPLOYEE_HOME_ZIPCODE_VISIBILITY':
        return {
          title: 'Home Postal Code',
          description: 'Can see the Home postal code on your profile'
        };
      default:
        return { title: '', description: '' };
    }
  };

  const { title, description } = getPermissionDetails();

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="text-sm font-medium">{title}</h4>
          <PermissionTooltip permission={permission} />
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Switch checked={enabled} onChange={(checked) => onChange(permission, checked)} />
    </div>
  );
}