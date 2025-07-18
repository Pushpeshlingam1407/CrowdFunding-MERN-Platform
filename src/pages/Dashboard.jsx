import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import io from 'socket.io-client';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0
  });
  const socket = io('http://localhost:5000');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    socket.on('projectCreated', (newProject) => {
      setProjects(prev => [...prev, newProject]);
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + (newProject.status === 'pending' ? 1 : 0),
        active: prev.active + (newProject.status === 'active' ? 1 : 0)
      }));
    });

    socket.on('projectDeleted', (deletedProjectId) => {
      setProjects(prev => prev.filter(project => project._id !== deletedProjectId));
      const deletedProject = projects.find(p => p._id === deletedProjectId);
      if (deletedProject) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          pending: prev.pending - (deletedProject.status === 'pending' ? 1 : 0),
          active: prev.active - (deletedProject.status === 'active' ? 1 : 0)
        }));
      }
    });

    return () => {
      socket.off('projectCreated');
      socket.off('projectDeleted');
    };
  }, [socket, projects]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const active = response.data.filter(p => p.status === 'active').length;
      const pending = response.data.filter(p => p.status === 'pending').length;
      setStats({ total, active, pending });
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update local state by filtering out the deleted project
        setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
        
        // Update statistics
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          active: prev.active - (projects.find(p => p._id === id)?.status === 'active' ? 1 : 0),
          pending: prev.pending - (projects.find(p => p._id === id)?.status === 'pending' ? 1 : 0)
        }));
        
        toast.success('Project deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Welcome back, {user.name}!</h1>
          <p className="text-muted mb-0">Here's what's happening with your projects</p>
        </div>
        <Link to="/projects/new" className="btn btn-primary">
          + Create New Project
        </Link>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i className="bi bi-graph-up text-primary"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.total}</h3>
                <p className="text-muted mb-0">Total Projects</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <i className="bi bi-check-circle text-success"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.active}</h3>
                <p className="text-muted mb-0">Active Projects</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <i className="bi bi-clock text-warning"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.pending}</h3>
                <p className="text-muted mb-0">Pending Projects</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">My Projects</h5>
        </Card.Header>
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Target Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td>₹{project.targetAmount?.toLocaleString() || '-'}</td>
                <td>
                  <Badge bg={project.status === 'active' ? 'success' : 'warning'}>
                    {project.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/projects/${project._id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default Dashboard;