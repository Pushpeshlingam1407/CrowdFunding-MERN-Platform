import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';


const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    comments: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
      setLoading(false);
    }
  };

  const handleReview = (project) => {
    setSelectedProject(project);
    setReviewForm({
      status: project.status,
      comments: project.reviewComments || ''
    });
    setShowReviewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${selectedProject._id}/review`, reviewForm);

      if (!response.ok) throw new Error('Failed to update project status');

      toast.success('Project review submitted successfully');
      setShowReviewModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      active: 'success',
      completed: 'info',
      rejected: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  // Approve the project
  const approveProject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${id}/status`, { status: 'approved' });

      if (!response.data.success) {
        throw new Error('Failed to approve project');
      }

      toast.success('Project approved successfully');
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error('Error approving project:', error);
      toast.error('Failed to approve project');
    }
  };

  return (
    <AdminLayout>
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Projects</h2>
        </div>

        <Table responsive hover className="bg-white shadow-sm rounded">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Creator</th>
              <th>Target Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.creator?.name || 'Unknown'}</td>
                  <td>₹{project.targetAmount?.toLocaleString() || 0}</td>
                  <td>{getStatusBadge(project.status)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        href={`/projects/${project._id}`}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(project._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      {/* Add Approve Button */}
                      {project.status !== 'approved' && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => approveProject(project._id)}
                        >
                          <CheckCircle size={16} /> Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Review Modal */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Review Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject && (
              <>
                <div className="mb-4">
                  <h5>{selectedProject.title}</h5>
                  <p className="text-muted">{selectedProject.description}</p>
                </div>

                <Form onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <div className="d-flex gap-2">
                      <Button
                        variant={reviewForm.status === 'approved' ? 'success' : 'outline-success'}
                        onClick={() => setReviewForm({ ...reviewForm, status: 'approved' })}
                        type="button"
                      >
                        <CheckCircle size={18} className="me-2" />
                        Approve
                      </Button>
                      <Button
                        variant={reviewForm.status === 'rejected' ? 'danger' : 'outline-danger'}
                        onClick={() => setReviewForm({ ...reviewForm, status: 'rejected' })}
                        type="button"
                      >
                        <XCircle size={18} className="me-2" />
                        Reject
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Review Comments</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={reviewForm.comments}
                      onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                      placeholder="Add your review comments here..."
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Submit Review
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default AdminProjects;
