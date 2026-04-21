import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Users, Shield, Briefcase, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Flex, Grid, Card } from '../components/ui';
import useAuthStore from '../store/authStore';

const HeroSection = styled.section`
  padding: 8rem 0;
  text-align: center;
  background: radial-gradient(circle at top, #0077b60a 0%, #ffffff 100%);
`;

const Badge = styled.div`
  display: inline-flex;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};

  span {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}10;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const FeatureText = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

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
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge>Trusted by 10,000+ Startups & Investors</Badge>
            <Title>
              Connecting the <span>Startup Ecosystem</span> <br /> for B2B Success
            </Title>
            <Subtitle>
              The premium B2B SaaS platform for startups, single investors, MNCs, and employees. 
              Find services, post jobs, and fund the next big thing.
            </Subtitle>
            <Flex justify="center" gap="1rem">
              <Button size="lg" onClick={handleGetStarted}>
                {user ? 'Go to Dashboard' : 'Join the Network'} <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/campaigns')}>
                Explore Campaigns
              </Button>
            </Flex>
          </motion.div>
        </Container>
      </HeroSection>

      <section style={{ padding: '6rem 0' }}>
        <Container>
          <SectionHeader>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>One Platform, Endless Possibilities</h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Everything you need to scale your startup or portfolio.</p>
          </SectionHeader>
          <Grid cols={3}>
            <Card>
              <FeatureIcon><Zap size={24} /></FeatureIcon>
              <FeatureTitle>Startup Funding</FeatureTitle>
              <FeatureText>Launch campaigns, attract investors, and get the capital you need to scale your vision.</FeatureText>
            </Card>
            <Card>
              <FeatureIcon><Briefcase size={24} /></FeatureIcon>
              <FeatureTitle>B2B Services</FeatureTitle>
              <FeatureText>Connect with MNCs and startups to provide or find specialized services in a secure marketplace.</FeatureText>
            </Card>
            <Card>
              <FeatureIcon><Users size={24} /></FeatureIcon>
              <FeatureTitle>Talent Network</FeatureTitle>
              <FeatureText>Find high-impact roles or hire the best employees from a pool of vetted professionals.</FeatureText>
            </Card>
            <Card>
              <FeatureIcon><Target size={24} /></FeatureIcon>
              <FeatureTitle>Smart Investing</FeatureTitle>
              <FeatureText>Individual investors can discover high-potential startups with detailed metrics and reviews.</FeatureText>
            </Card>
            <Card>
              <FeatureIcon><Shield size={24} /></FeatureIcon>
              <FeatureTitle>Secure Private Space</FeatureTitle>
              <FeatureText>Exclusive communication channels and document sharing protected by enterprise-grade security.</FeatureText>
            </Card>
            <Card>
              <FeatureIcon><Globe size={24} /></FeatureIcon>
              <FeatureTitle>Global Connection</FeatureTitle>
              <FeatureText>Break geographical barriers and connect with partners from around the world.</FeatureText>
            </Card>
          </Grid>
        </Container>
      </section>

      <section style={{ padding: '6rem 0', background: '#fafafa' }}>
        <Container>
          <Card style={{ background: '#0077b6', color: '#fff', textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to transform your business?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9 }}>Join StartupFund today and start connecting with the leaders of tomorrow.</p>
            <Button 
                style={{ background: '#fff', color: '#0077b6' }} 
                size="lg" 
                onClick={handleGetStarted}
            >
              Get Started for Free
            </Button>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default Home;
