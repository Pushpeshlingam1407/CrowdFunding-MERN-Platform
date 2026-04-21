import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Building2, Briefcase, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Input, Card, Container, Flex, Grid } from './ui';
import api from "../services/api";

const RegisterWrapper = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  background: radial-gradient(circle at bottom left, #0077b60a 0%, #ffffff 100%);
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
  margin-bottom: 1.25rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.5rem;
`;

const FormIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 2.3rem;
  color: #9e9e9e;
  z-index: 1;
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: #fafafa;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(0, 119, 182, 0.1);
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 2rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #666;

  input {
    margin-top: 0.2rem;
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'startup',
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

    try {
      setLoading(true);
      const { confirmPassword, agreeToTerms, firstName, lastName, ...registerData } = formData;
      registerData.name = `${firstName} ${lastName}`.trim();

      await api.post('/auth/register', registerData);
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Register Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterWrapper>
      <Container>
        <Flex justify="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            <Card>
              <FormTitle>Create Account</FormTitle>
              <FormSubtitle>Join the premium B2B SaaS ecosystem</FormSubtitle>

              <form onSubmit={handleSubmit}>
                <Grid cols={2} gap="1rem">
                  <FormGroup>
                    <Label>First Name</Label>
                    <FormIcon><User size={18} /></FormIcon>
                    <StyledInput
                      type="text"
                      name="firstName"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <FormIcon><User size={18} /></FormIcon>
                    <StyledInput
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Grid>

                <FormGroup>
                  <Label>Email Address</Label>
                  <FormIcon><Mail size={18} /></FormIcon>
                  <StyledInput
                    type="email"
                    name="email"
                    placeholder="jane@company.com"
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
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Confirm Password</Label>
                  <FormIcon><Lock size={18} /></FormIcon>
                  <StyledInput
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>I am a...</Label>
                  <FormIcon><Briefcase size={18} /></FormIcon>
                  <StyledSelect
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="startup">Startup</option>
                    <option value="investor">Single Investor</option>
                    <option value="mnc">MNC / Enterprise</option>
                    <option value="employee">Individual Employee</option>
                  </StyledSelect>
                </FormGroup>

                <CheckboxContainer>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to the <Link to="/terms" style={{ color: '#0077b6', textDecoration: 'none' }}>Terms of Service</Link>, 
                    <Link to="/privacy" style={{ color: '#0077b6', textDecoration: 'none' }}> Privacy Policy</Link>, and 
                    <Link to="/agreement" style={{ color: '#0077b6', textDecoration: 'none' }}> User Agreement</Link>.
                  </span>
                </CheckboxContainer>

                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', marginBottom: '1.5rem' }}
                >
                  <UserPlus size={18} style={{ marginRight: 8 }} />
                  {loading ? 'Creating Account...' : 'Join StartupFund'}
                </Button>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#0077b6', fontWeight: 600, textDecoration: 'none' }}>
                      Log in
                    </Link>
                  </span>
                </div>
              </form>
            </Card>
          </motion.div>
        </Flex>
      </Container>
    </RegisterWrapper>
  );
};

export default Register;
