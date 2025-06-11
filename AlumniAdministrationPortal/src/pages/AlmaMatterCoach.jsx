import { useState } from 'react';
import { Input, Button, Card, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/PageHeader';
import AlumniPost from '../components/AlumniPost';
import EmployerChangesTable from '../components/EmployerChangesTable';
import LocationChangesTable from '../components/LocationChangesTable';
import { processQuery, QueryType } from '../services/aiService';
import { fetchDraftAccomplishments } from '../services/accomplishmentService';
import { fetchRecentEmployerChanges } from '../services/employerService';
import { fetchRecentLocationChanges } from '../services/locationService';

const { TextArea } = Input;

const AlmaMatterCoach = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [queryType, setQueryType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const type = await processQuery(query);
      setQueryType(type);

      let resultData;
      switch (type) {
        case QueryType.SHOW_DRAFT_ACCOMPLISHMENTS:
          resultData = await fetchDraftAccomplishments();
          break;
        case QueryType.SHOW_EMPLOYER_CHANGES:
          resultData = await fetchRecentEmployerChanges();
          break;
        case QueryType.SHOW_LOCATION_CHANGES:
          resultData = await fetchRecentLocationChanges();
          break;
        default:
          setData(null);
          return;
      }
      setData(resultData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!data) return null;

    switch (queryType) {
      case QueryType.SHOW_DRAFT_ACCOMPLISHMENTS:
        return (
          <div className="space-y-4">
            {data.map(post => (
              <AlumniPost 
                key={post.id}
                post={post}
                onAction={() => {}}
              />
            ))}
          </div>
        );
      case QueryType.SHOW_EMPLOYER_CHANGES:
        return (
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">
              These are the alumni who changed jobs in the last 24 hours:
            </h3>
            <EmployerChangesTable data={data} />
          </div>
        );
      case QueryType.SHOW_LOCATION_CHANGES:
        return (
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">
              These are the alumni who moved to new locations in the last 24 hours:
            </h3>
            <LocationChangesTable data={data} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader />
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">
        AlmaMatter Coach
      </h2>
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <div className="mb-4">
            <TextArea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me about alumni accomplishments, employer changes, or location changes..."
              className="mb-4"
            />
            <Button 
              type="primary"
              onClick={handleSubmit}
              icon={<FontAwesomeIcon icon={faPaperPlane} />}
              disabled={loading}
              style={{marginTop:'2%'}}
            >
              Send
            </Button>
          </div>
          
          {loading && (
            <div className="text-center">
              <Spin />
            </div>
          )}
          
          {data && (
            <Card className="bg-gray-50" style={{marginTop:'5%', width:'80%', marginLeft:'10%'}}>
              {renderResults()}
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AlmaMatterCoach;