import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate passwords if trying to change password
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          toast.error('Please enter your current password');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
      }

      // Prepare update data
      const updateData = {
        name: formData.name
      };

      // Only include password fields if trying to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }

      // Make API call to update profile
      const response = await axios.put('http://localhost:5000/api/auth/profile', updateData);
      
      // Update local user state
      updateUser(response.data);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">Profile Settings</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />

                <h5 className="mb-3">Change Password</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 