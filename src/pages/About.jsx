import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .about-box {
          background: #ffffff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
          transition: all 0.3s ease;
        }

        .about-box:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .about-heading {
          color: #1c1c1e;
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .section-title {
          color: #0d6efd;
          font-size: 1.75rem;
          margin-top: 1.5rem;
        }

        .section-text {
          color: #333;
          font-size: 1.1rem;
        }

        .btn-custom {
          background-color: #0d6efd;
          border: none;
          padding: 10px 20px;
          font-weight: 500;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .btn-custom:hover {
          background-color: #0b5ed7;
        }
      `}</style>

      <Container className="py-5">
        <div className="about-box">
          <Button 
            variant="primary"
            className="btn-custom mb-4"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <h1 className="about-heading">About StartupFund</h1>
          
          <div>
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              StartupFund connects innovative startups with passionate investors...
            </p>

            <h2 className="section-title">Our Story</h2>
            <p className="section-text">
              Founded in 2024, StartupFund has been bridging the gap between ideas and funding...
            </p>

            <h2 className="section-title">Our Team</h2>
            <p className="section-text">
              We are a dedicated team of professionals committed to fostering innovation...
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default About;
