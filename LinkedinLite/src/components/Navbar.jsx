import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserFriends, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../utils/supabase';
import NotificationBell from './notifications/NotificationBell';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">Linkedin Hack25</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </Link>
            <Link to="/network" className="text-gray-600 hover:text-blue-600">
              <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
              Network
            </Link>
            <NotificationBell />
            <Button type="text" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;