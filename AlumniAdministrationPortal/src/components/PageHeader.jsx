import { Link } from 'react-router-dom';

const PageHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-block">
        <h1 className="text-4xl font-bold text-primary hover:text-primary/80 transition-colors">
          Alumni Administration Portal
        </h1>
      </Link>
    </div>
  );
};

export default PageHeader;