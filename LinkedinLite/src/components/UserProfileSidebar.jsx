import { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getUserProfile, updateUserProfile } from '../utils/userService';
import { useAuth } from '../hooks/useAuth';

const { Option } = Select;

const EMPLOYERS = ['LinkedIn', 'Apple', 'Meta', 'Netflix', 'NVIDIA', 'Alphabet'];

const EMPLOYER_LOGOS = {
  LinkedIn: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  Apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  Meta: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
  Netflix: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png',
  NVIDIA: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
  Alphabet: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
};

const COUNTRIES = {
  USA: ['New York', 'San Francisco', 'Los Angeles'],
  INDIA: ['Mumbai', 'Bangalore', 'Delhi'],
  EUROPE: ['London', 'Paris', 'Berlin'],
  AUSTRALIA: ['Sydney', 'Melbourne', 'Brisbane'],
  CHINA: ['Beijing', 'Shanghai', 'Shenzhen']
};

export default function UserProfileSidebar() {
  const [profile, setProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cities, setCities] = useState([]);
  const [form] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        employer: profile.employer || 'LinkedIn',
        country: profile.country || 'USA',
        city: profile.city || 'Sunnyvale'
      });
      
      const initialCountry = profile.country || 'USA';
      setCities(COUNTRIES[initialCountry] || []);
    }
  }, [profile, form]);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile(user.id);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async (values) => {
    try {
      await updateUserProfile(user.id, values);
      message.success('Profile updated successfully');
      loadProfile();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleCountryChange = (value) => {
    form.setFieldValue('city', undefined);
    setCities(COUNTRIES[value] || []);
  };

  if (!profile) return null;

  return (
    <>
      <Card className="sticky top-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-blue-600">
              {profile.first_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {profile.first_name && profile.last_name 
              ? `${profile.first_name} ${profile.last_name}`
              : 'Complete Your Profile'}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
            <span>{profile.email}</span>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => setIsModalVisible(true)}
              className="flex items-center"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            {profile.employer && EMPLOYER_LOGOS[profile.employer] && (
              <img 
                src={EMPLOYER_LOGOS[profile.employer]} 
                alt={profile.employer}
                className="h-6 object-contain"
              />
            )}
            <span className="text-sm text-gray-500">{profile.employer}</span>
          </div>
          {profile.country && profile.city && (
            <p className="text-sm text-gray-500">
              📍 {profile.city}, {profile.country}
            </p>
          )}
        </div>
      </Card>

      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item
            name="employer"
            label="Employer"
            rules={[{ required: true, message: 'Please select your employer' }]}
          >
            <Select>
              {EMPLOYERS.map(employer => (
                <Option key={employer} value={employer}>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={EMPLOYER_LOGOS[employer]} 
                      alt={employer}
                      className="h-4 w-4 object-contain"
                    />
                    <span>{employer}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please select your country' }]}
          >
            <Select onChange={handleCountryChange}>
              {Object.keys(COUNTRIES).map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please select your city' }]}
          >
            <Select>
              {cities.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}