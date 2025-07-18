import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const content = loading ? (
    <Container className="py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </Container>
  ) : (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Projects</Card.Title>
              <Card.Text>Manage all projects</Card.Text>
              <Button variant="primary" onClick={() => navigate('/admin/projects')}>
                View Projects
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>Manage user accounts</Card.Text>
              <Button variant="primary" onClick={() => navigate('/admin/users')}>
                View Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Analytics</Card.Title>
              <Card.Text>View platform statistics</Card.Text>
              <Button variant="primary" onClick={() => navigate('/admin/analytics')}>
                View Analytics
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        {content}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
