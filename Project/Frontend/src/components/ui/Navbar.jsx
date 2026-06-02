import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Flex } from './index';
import useAuthStore from '../../store/authStore';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  transition: color 0.2s;
  font-size: 0.95rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  letter-spacing: -1.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Nav>
      <Container>
        <Flex justify="space-between">
          <Flex gap="3rem">
            <Logo to="/">Startup<span>Fund</span></Logo>
            <Flex gap="2rem">
              <NavLink to="/campaigns">Marketplace</NavLink>
              <NavLink to="/about">About Ecosystem</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/messages">Private Space</NavLink>
                </>
              )}
            </Flex>
          </Flex>

          <Flex gap="1.5rem">
            {!isAuthenticated ? (
              <Flex gap="1.5rem">
                <NavLink to="/login">Sign In</NavLink>
                <Button onClick={() => navigate('/register')} style={{ padding: '0.6rem 1.5rem' }}>Get Started</Button>
              </Flex>
            ) : (
              <Flex gap="1.5rem">
                <NavLink to="/profile" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#0077b615', color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{user?.name.charAt(0)}</div>
                   {user?.name.split(' ')[0]}
                </NavLink>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Container>
    </Nav>
  );
};


export default Navbar;
