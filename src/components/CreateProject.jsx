import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    targetAmount: '',
    startDate: '',
    endDate: '',
    imageType: 'url',    // only URL supported for now
    imageUrl: '',
    equity: '',
  });

  const categories = [
    'Technology',
    'Education',
    'Healthcare',
    'Environment',
    'Social',
    'Other',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to Number
    const numericFields = ['equity', 'targetAmount'];
    const parsed = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsed,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate image URL
    if (!formData.imageUrl.trim()) {
      toast.error('Please enter a valid image URL.');
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      targetAmount: Number(formData.targetAmount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      image: formData.imageUrl.trim(),
      equity: Number(formData.equity),
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/projects/createproject',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Project created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(
        err.response?.data?.message || 'Unexpected error—please try again.'
      );
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-primary">🚀 Create New Project</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Title */}
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Project Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter your project title"
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-4" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe the project's vision and goals"
            />
          </Form.Group>

          {/* Category & Target Amount */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="targetAmount">
                <Form.Label>Target Amount (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  required
                  min={0}
                  placeholder="e.g. 50000"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Dates */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  min={
                    formData.startDate ||
                    new Date().toISOString().split('T')[0]
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Equity */}
          <Form.Group className="mb-3" controlId="equity">
            <Form.Label>Equity Offered (%)</Form.Label>
            <Form.Control
              type="number"
              name="equity"
              value={formData.equity}
              onChange={handleInputChange}
              placeholder="e.g. 10"
              min={0}
              max={100}
              required
            />
            <Form.Text className="text-muted">
              Percentage of equity offered to investors
            </Form.Text>
          </Form.Group>

          {/* Image URL */}
          <Form.Group className="mb-4" controlId="imageUrl">
            <Form.Label>Project Image URL</Form.Label>
            <Form.Control
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/cover.jpg"
              required
            />
            <Form.Text className="text-muted">
              We currently support **URL** only for images.
            </Form.Text>
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create Project'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateProject;
