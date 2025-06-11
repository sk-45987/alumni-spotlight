import { faCalendarPlus, faTrophy, faNewspaper, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';

const Home = () => {
  const navigate = useNavigate();

  const adminActions = [
    {
      title: 'Plan an Alumni Event',
      icon: faCalendarPlus,
      description: 'Create and manage upcoming alumni events',
      path: '/plan-event'
    },
    {
      title: 'AlmaMatter Coach',
      icon: faGraduationCap,
      description: 'Connect with AlmaMatter coaching services',
      path: '/almamatter-coach'
    },
    {
      title: 'Alumni Public Feed',
      icon: faNewspaper,
      description: 'Manage and moderate the alumni public feed',
      path: '/public-feed'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <PageHeader />
        <p className="text-xl text-gray-600 text-center mb-16">Manage your university's alumni community</p>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 justify-center items-stretch">
          {adminActions.map((action, index) => (
            <div key={index} className="flex-1 min-w-[300px]">
              <AdminCard
                title={action.title}
                icon={action.icon}
                description={action.description}
                onClick={() => navigate(action.path)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;