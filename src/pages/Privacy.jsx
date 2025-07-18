import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .privacy-box {
          background: #ffffff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
          transition: all 0.3s ease;
        }

        .privacy-box:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .privacy-heading {
          color: #1c1c1e;
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .privacy-section-title {
          color: #0d6efd;
          font-size: 1.75rem;
          margin-top: 1.5rem;
        }

        .privacy-section-text {
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
        <div className="privacy-box">
          <Button 
            variant="primary"
            className="btn-custom mb-4"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <h1 className="privacy-heading">Privacy Policy</h1>

          <div>
            <h2 className="privacy-section-title">1. Data Collection</h2>
            <p className="privacy-section-text">
              We collect information that you provide directly to us...
            </p>

            <h2 className="privacy-section-title">2. Use of Information</h2>
            <p className="privacy-section-text">
              We use the information we collect to operate and improve our platform...
            </p>

            <h2 className="privacy-section-title">3. Data Protection</h2>
            <p className="privacy-section-text">
              We implement appropriate security measures to protect your personal information...
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Privacy;
