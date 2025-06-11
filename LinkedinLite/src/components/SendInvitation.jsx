import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { sendInvitation } from '../utils/invitationService';

function SendInvitation({ onInvitationSent }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await sendInvitation(values.email);
      message.success('Invitation sent successfully!');
      form.resetFields();
      onInvitationSent?.();
    } catch (error) {
      message.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
      >
        <Input placeholder="Enter email to invite" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Send Invitation
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SendInvitation;