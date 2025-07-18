import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Target } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch project details');
      const data = await response.json();
      setProject(data);
    } catch (error) {
      toast.error('Error loading project details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount || isNaN(amount)) return '0';
    return Number(amount).toLocaleString('en-IN');
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

  if (!project) {
    return (
      <Container className="py-5 text-center">
        <h2>Project not found</h2>
      </Container>
    );
  }

  const progress = project.targetAmount ? 
    Math.min(((project.currentAmount || 0) / project.targetAmount) * 100, 100) : 0;
    const handleDonate = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 500 })  // Static ₹500 donation for now
        });
    
        const data = await response.json();
    
        const options = {
          key: "YOUR_RAZORPAY_KEY", // Replace with Razorpay Test Key
          amount: data.order.amount,
          currency: "INR",
          name: "CrowdFundingX",
          description: project.title,
          order_id: data.order.id,
          handler: function (response) {
            toast.success("Payment successful! ID: " + response.razorpay_payment_id);
          },
          theme: { color: "#0d6efd" }
        };
    
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        toast.error("Payment failed or cancelled.");
      }
    };
    
  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm mb-4">
            <div className="position-relative">
              <Card.Img 
                variant="top" 
                src={project.image?.startsWith('http') ? project.image : `http://localhost:5000${project.image}`}
                alt={project.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=Project+Image';
                }}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 m-3">
                <Badge bg={project.status === 'approved' ? 'success' : 'warning'} className="fs-6">
                  {project.status}
                </Badge>
              </div>
            </div>
            
            <Card.Body className="p-4">
              <Badge bg="primary" className="mb-3">{project.category}</Badge>
              
              <h1 className="mb-4">{project.title}</h1>
              
              <div className="mb-4">
                <h5>Project Description</h5>
                <p className="text-muted">{project.description}</p>
              </div>

              <div className="mb-4">
                <h5>Funding Goal</h5>
                <h3 className="text-primary mb-2">₹{formatAmount(project.targetAmount)}</h3>
                <ProgressBar 
                  now={progress} 
                  label={`${Math.round(progress)}%`}
                  className="mb-2" 
                  style={{ height: '10px' }}
                />
                <div className="d-flex justify-content-between text-muted">
                  <span>Raised: ₹{formatAmount(project.currentAmount)}</span>
                  <span>Goal: ₹{formatAmount(project.targetAmount)}</span>
                </div>
              </div>
              <div className="text-center my-3">
              <Button variant="success" size="lg" onClick={handleDonate}>
                💸 Donate ₹500
              </Button>
            </div>


              <div className="mb-4">
                <h5>Campaign Duration</h5>
                <div className="d-flex gap-4">
                  <div>
                    <Calendar size={20} className="text-muted me-2" />
                    <small className="text-muted">Start Date:</small>
                    <div>{project.startDate ? formatDate(project.startDate) : 'Not set'}</div>
                  </div>
                  <div>
                    <Target size={20} className="text-muted me-2" />
                    <small className="text-muted">End Date:</small>
                    <div>{project.endDate ? formatDate(project.endDate) : 'Not set'}</div>
                  </div>
                </div>
              </div>

              <div className="border-top pt-4">
                <div className="d-flex align-items-center">
                  <Users size={20} className="text-muted me-2" />
                  <div>
                    <small className="text-muted d-block">Created by</small>
                    <span>{project.creator?.name}</span>
                  </div>
                </div>
              </div>

              {user?._id === project.creator?._id && (
                <div className="mt-4 d-flex gap-2">
                  <Button 
                    variant="outline-primary"
                    onClick={() => navigate(`/projects/${id}/edit`)}
                  >
                    Edit Project
                  </Button>
                  <Button 
                    variant="outline-danger"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this project?')) {
                        try {
                          const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                          });
                          if (!response.ok) throw new Error('Failed to delete project');
                          toast.success('Project deleted successfully');
                          navigate('/dashboard');
                        } catch (error) {
                          toast.error('Failed to delete project');
                          console.error(error);
                        }
                      }
                    }}
                  >
                    Delete Project
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetails; 