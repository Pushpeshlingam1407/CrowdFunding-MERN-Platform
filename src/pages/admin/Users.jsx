import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import { toast } from 'react-toastify';
import axios from 'axios';
import Footer from '../../components/Footer';

const API_URL = 'http://localhost:5000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    individual: 0,
    institutional: 0,
    angel: 0,
    active: 0,
    inactive: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate(); // 👈 Hook to navigate

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedUsers = response.data;
      setUsers(fetchedUsers);

      const newStats = {
        total: fetchedUsers.length,
        individual: fetchedUsers.filter(u => u.role === 'individual').length,
        institutional: fetchedUsers.filter(u => u.role === 'institutional').length,
        angel: fetchedUsers.filter(u => u.role === 'angel').length,
        active: fetchedUsers.filter(u => u.isVerified).length,
        inactive: fetchedUsers.filter(u => !u.isVerified).length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/admin/users/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user status');
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'individual': return 'primary';
      case 'institutional': return 'success';
      case 'angel': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        <Container className="py-5">
          {/* 👇 Back to Dashboard Button */}
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h1
              className="mb-0"
              style={{ color: "#0d6efd", fontWeight: "bold" }}
            >
              StartupFund
            </h1>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/admin/dashboard")}
            >
              ← Back to Dashboard
            </Button>
          </div>

          <h2 className="mb-4">User Management</h2>

          {/* Stats Cards */}
          <Row className="mb-4">
            {/* ... all Col stats remain unchanged ... */}
            {[
              "total",
              "individual",
              "institutional",
              "angel",
              "active",
              "inactive",
            ].map((key, index) => (
              <Col md={4} lg={2} className="mb-3" key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <h3 className="mb-2">{stats[key]}</h3>
                    <Card.Text className="text-muted">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Users Table */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Table responsive hover className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge
                          bg={getBadgeVariant(user.role)}
                          className="px-3 py-2"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={user.isVerified ? "success" : "danger"}
                          className="px-3 py-2"
                        >
                          {user.isVerified ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </Button>
                        <Button
                          variant={
                            user.isVerified
                              ? "outline-danger"
                              : "outline-success"
                          }
                          size="sm"
                          onClick={() => handleDeactivateUser(user._id)}
                        >
                          {user.isVerified ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <Footer />

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.isVerified ? "Active" : "Inactive"}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Joined Date:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Projects Created:</strong>{" "}
                  {selectedUser.createdProjects?.length || 0}
                </p>
                <p>
                  <strong>Investments Made:</strong>{" "}
                  {selectedUser.investments?.length || 0}
                </p>
                {selectedUser.bio && (
                  <p>
                    <strong>Bio:</strong> {selectedUser.bio}
                  </p>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
