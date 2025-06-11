import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'antd';

const AdminCard = ({ title, icon, description, onClick }) => {
  return (
    <Card 
      hoverable
      className="h-full transform transition-all duration-300 hover:scale-105 
        bg-white/80 hover:bg-primary/10 shadow-xl hover:shadow-2xl border-2 
        border-primary/20 hover:border-primary/40 group rounded-xl"
      onClick={onClick}
    >
      <div className="text-center p-8">
        <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
          group-hover:bg-primary/30 transition-colors duration-300 transform group-hover:scale-110">
          <FontAwesomeIcon icon={icon} className="text-4xl text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-primary/80">{title}</h3>
        <p className="text-gray-600 text-lg group-hover:text-gray-700">{description}</p>
      </div>
    </Card>
  );
};

export default AdminCard;