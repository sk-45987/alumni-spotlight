import { Badge } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  return (
    <Link to="/notifications" className="relative">
      <Badge>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <FontAwesomeIcon icon={faBell} className="text-xl" />
        </button>
      </Badge>
    </Link>
  );
}