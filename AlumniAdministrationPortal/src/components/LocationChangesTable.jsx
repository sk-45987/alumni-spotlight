import { Table, Tooltip, Avatar, message } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';

const LocationChangesTable = ({ data }) => {
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const mockNames = [
    'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 
    'James Johnson', 'Lisa Anderson', 'Robert Taylor', 'Jennifer Martin'
  ];

  const relevanceColors = {
    25: 'border-yellow-400',
    50: 'border-violet-500',
    75: 'border-green-500',
    100: 'border-green-500'
  };

  const getRandomAlumni = (city, country, count) => {
    const shuffled = [...mockNames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(name => ({
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@alumni.edu`,
      relevance: [25, 50, 75, 100][Math.floor(Math.random() * 4)]
    }));
  };

  const handleAvatarDoubleClick = (alumni) => {
    setSelectedAlumni(alumni);
    message.info(`Selected ${alumni.name} for connection`);
  };

  const handleConnect = (record) => {
    if (!selectedAlumni) {
      message.warning('Please double-click an avatar to select an alumni first');
      return;
    }
    
    const alumniName = `${record.profiles.first_name} ${record.profiles.last_name}`;
    message.success(`Connecting ${alumniName} with ${selectedAlumni.name}`);
    setSelectedAlumni(null);
  };

  const columns = [
    {
      title: 'Alumni Name',
      key: 'name',
      render: (record) => `${record.profiles.first_name} ${record.profiles.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: ['profiles', 'email'],
      key: 'email',
    },
    {
      title: 'Location',
      key: 'location',
      render: (record) => `${record.city}, ${record.country}`,
    },
    {
      title: 'Other Alumni in same Location',
      key: 'otherAlumni',
      render: (record) => {
        const otherAlumni = getRandomAlumni(record.city, record.country, Math.floor(Math.random() * 3) + 1);
        
        return (
          <div className="flex gap-2">
            {otherAlumni.map((alumni, index) => (
              <Tooltip 
                key={index} 
                title={`${alumni.name} (${alumni.email}) - Match Relevance: ${alumni.relevance}%`}
                placement="top"
              >
                <div className={`inline-block ${relevanceColors[alumni.relevance]} rounded-full p-[5px] ${
                  selectedAlumni?.name === alumni.name ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <Avatar
                    icon={<UserOutlined />}
                    className="bg-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-300"
                    style={{ 
                      backgroundColor: '#f0f0f0',
                      color: '#666',
                    }}
                    onDoubleClick={() => handleAvatarDoubleClick(alumni)}
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Connect',
      key: 'connect',
      render: (record) => (
        <MailOutlined
          className="text-xl cursor-pointer text-primary hover:text-primary/80 transition-colors"
          onClick={() => handleConnect(record)}
        />
      ),
    }
  ];

  return (
    <Table 
      dataSource={data}
      columns={columns}
      rowKey="id"
      className="w-full"
      pagination={false}
    />
  );
};

export default LocationChangesTable;