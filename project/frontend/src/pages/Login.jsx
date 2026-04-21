import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button, Input, Card, Container, Flex } from '../components/ui';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const LoginWrapper = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top right, #0077b60a 0%, #ffffff 100%);
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -1px;
`;

const FormSubtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.5rem;
`;

const ErrorBox = styled.div`
  background: #fff5f5;
  color: #e53e3e;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #fed7d7;
`;

const FormIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 2.3rem;
  color: #9e9e9e;
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
`;

// Small "go to admin login" link at bottom
const AdminHint = styled.div`
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 119, 182, 0.05);
  border: 1px solid rgba(0, 119, 182, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #555;

  a {
    color: #0077b6;
    font-weight: 700;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  
  const { login, adminLogin, isAuthenticated, adminAuthenticated, error, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (adminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [adminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First try admin login — if credentials match admin account, go straight to admin dashboard
    const adminSuccess = await adminLogin(formData.email, formData.password);
    if (adminSuccess) {
      toast.success('Welcome, Admin! Redirecting to Admin Dashboard…');
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    // Otherwise do regular user login
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <LoginWrapper>
      <Container>
        <Flex justify="center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: '440px' }}
          >
            <Card>
              <FormTitle>Welcome Back</FormTitle>
              <FormSubtitle>Log in to access the B2B SaaS network</FormSubtitle>
              
              {error && (
                <ErrorBox>
                  <AlertCircle size={18} />
                  {error}
                </ErrorBox>
              )}
              
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Email address</Label>
                  <FormIcon><Mail size={18} /></FormIcon>
                  <StyledInput
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Password</Label>
                  <FormIcon><Lock size={18} /></FormIcon>
                  <StyledInput
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ width: '100%', marginBottom: '1.5rem' }}
                >
                  <LogIn size={18} style={{ marginRight: 8 }} />
                  {isLoading ? 'Verifying...' : 'Log in'}
                </Button>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    New to StartupFund?{' '}
                    <Link to="/register" style={{ color: '#0077b6', fontWeight: 600, textDecoration: 'none' }}>
                      Get started
                    </Link>
                  </span>
                </div>
              </form>

              {/* Admin hint */}
              <AdminHint>
                <ShieldCheck size={15} style={{ color: '#0077b6', flexShrink: 0 }} />
                Admin? Use your admin credentials above or{' '}
                <Link to="/admin/login">go to the Admin Portal →</Link>
              </AdminHint>
            </Card>
          </motion.div>
        </Flex>
      </Container>
    </LoginWrapper>
  );
};

export default Login;