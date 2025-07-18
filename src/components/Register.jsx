import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    investorType: 'individual',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, agreeToTerms, firstName, lastName, investorType, ...registerData } = formData;
      
      // Combine first and last name
      registerData.name = `${firstName} ${lastName}`.trim();
      // Set role directly from investorType since they match the model's enum values
      registerData.role = investorType;

      await authAPI.register(registerData);
      
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Register Error:', error);
      // Error toast is handled by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-sm" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Investor Type</label>
              <select
                name="investorType"
                className="form-select"
                value={formData.investorType}
                onChange={handleChange}
              >
                <option value="individual">Individual Investor</option>
                <option value="institutional">Institutional Investor</option>
                <option value="angel">Angel Investor</option>
              </select>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  className="form-check-input"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
              style={{ backgroundColor: '#0d6efd' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to="/login" className="text-decoration-none">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
