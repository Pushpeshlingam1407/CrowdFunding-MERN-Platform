import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .terms-box {
          background: #ffffff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
          transition: all 0.3s ease;
        }

        .terms-box:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .terms-heading {
          color: #1c1c1e;
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .terms-section-title {
          color: #0d6efd;
          font-size: 1.75rem;
          margin-top: 1.5rem;
        }

        .terms-section-text {
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
        <div className="terms-box">
          <Button 
            variant="primary"
            className="btn-custom mb-4"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <h1 className="terms-heading">Terms and Conditions</h1>

          <div>
            <h2 className="terms-section-title">1. Introduction</h2>
            <p className="terms-section-text">
              Welcome to StartupFund. By using our platform, you agree to these terms and conditions...
            </p>

            <h2 className="terms-section-title">2. Services</h2>
            <p className="terms-section-text">
              StartupFund provides a platform for connecting investors with promising startups...
            </p>

            <h2 className="terms-section-title">3. User Responsibilities</h2>
            <p className="terms-section-text">
              Users must provide accurate information and maintain security of their accounts...
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Terms;
