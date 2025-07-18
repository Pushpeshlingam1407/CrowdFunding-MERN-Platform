import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    image: null,
    newImage: ''
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
      const project = response.data;
      
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        targetAmount: project.targetAmount,
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
        image: project.image,
        newImage: '' // <-- Reset newImage on load
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        ...formData,
        image: formData.newImage && formData.newImage.trim() !== "" ? formData.newImage : formData.image
      };
      delete updatedData.newImage;

      await axios.put(`http://localhost:5000/api/projects/${id}`, updatedData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success('Project updated successfully');
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Edit Project</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                min="1000"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            
            <Form.Group className="mb-3">
              <Form.Label>Project Image URL</Form.Label>
              <Form.Control
                type="text"
                name="newImage"
                placeholder="Paste new image URL here"
                value={formData.newImage || ""}
                onChange={handleChange}
              />
              {formData.image && (
                <div className="mt-2">
                  <span className="text-muted">Current Image:</span>
                  <img
                    src={formData.image}
                    alt="Current project image"
                    className="mt-2"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
            </Form.Group>
            

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Project'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(`/projects/${id}`)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProject;