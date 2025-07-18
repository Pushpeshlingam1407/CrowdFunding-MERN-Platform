import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { ArrowRight, Rocket, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // no negative values
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects");
        setCampaigns(res.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch campaigns.");
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Extract unique categories from campaigns
  const categories = ["All", ...Array.from(new Set(campaigns.map(c => c.category).filter(Boolean)))];

  // Filter campaigns based on selected category
  const filteredCampaigns = selectedCategory === "All"
    ? campaigns
    : campaigns.filter(c => c.category === selectedCategory);

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Investment Opportunities</h1>
        <p className="lead text-muted">Discover and invest in promising startups across various industries</p>
      </div>

      {/* Category Dropdown */}
      <div className="mb-4 d-flex justify-content-end">
        <Form.Select
          style={{ maxWidth: 300 }}
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </div>

      {/* Loading & Error Handling */}
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Campaigns Grid */}
      <Row>
        {!loading && filteredCampaigns.map(campaign => (
          <Col key={campaign._id} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={campaign.image || 'https://via.placeholder.com/500x300?text=No+Image'}
                style={{ height: '240px', objectFit: 'cover' }}
              />
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <Badge bg="primary">{campaign.category}</Badge>
                  <Badge bg="info">{calculateDaysLeft(campaign.endDate)} days left</Badge>
                </div>
                <Card.Title className="h5">{campaign.title}</Card.Title>
                <Card.Text className="text-muted">{campaign.description?.slice(0, 130)}...</Card.Text>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Progress</span>
                    <span className="fw-bold">
                      {((campaign.currentAmount / campaign.targetAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    now={(campaign.currentAmount / campaign.targetAmount) * 100}
                    variant="success"
                  />
                  <div className="d-flex justify-content-between small mt-2 text-muted">
                    <span>Raised: ₹{campaign.currentAmount.toLocaleString()}</span>
                    <span>Goal: ₹{campaign.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <Row className="mb-3">
                    <Col xs={6}>
                      <div className="d-flex align-items-center">
                        <Users size={16} className="text-muted me-2" />
                        <span className="small text-muted">{campaign.creator?.name || 'Unknown'}</span>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="d-flex align-items-center">
                        <DollarSign size={16} className="text-muted me-2" />
                        <span className="small text-muted">Equity: {campaign.equity}</span>
                      </div>
                    </Col>
                  </Row>

                  <Link to={`/projects/${campaign._id}`}>
                    <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center">
                      View Details <ArrowRight size={18} className="ms-2" />
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA */}
      <div className="text-center mt-5 pt-3">
        <h3 className="mb-4">Don't miss out on the next big opportunity</h3>
        <Link to="/projects/new">
          <Button variant="success" size="lg">
            <Rocket size={20} className="me-2" />
            Launch Your Campaign
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Campaigns;
