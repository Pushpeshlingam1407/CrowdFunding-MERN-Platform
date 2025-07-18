// Home.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <>
      <section className="hero-section d-flex align-items-center">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 mb-4">Fund the Next Big Thing</h1>
              <p className="lead mb-4">
                Join our platform to invest in promising startups and be part of the next success story.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="d-inline-flex align-items-center"
                onClick={handleGetStarted}
              >
                {user ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="ms-2" size={20} />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col md={8}>
              <h2>Why Choose StartupFund?</h2>
              <p className="lead text-muted">
                We make startup investing accessible, transparent, and rewarding.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <h3 className="h4">Vetted Startups</h3>
                <p className="text-muted">
                  We carefully screen each startup to ensure quality investment opportunities.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="h4">Low Minimums</h3>
                <p className="text-muted">
                  Start investing with as little as $100 and build your portfolio.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="12" y1="16" x2="12" y2="8" />
                  </svg>
                </div>
                <h3 className="h4">Easy Management</h3>
                <p className="text-muted">
                  Track your investments and manage your portfolio with our intuitive dashboard.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2070"
                alt="Team collaboration"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h2>Ready to Start Investing?</h2>
              <p className="lead mb-4">
                Join thousands of investors who have already discovered promising startup opportunities on our platform.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="d-inline-flex align-items-center"
                onClick={handleGetStarted}
              >
                {user ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="ms-2" size={20} />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
