import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  Scale, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { Button, Card, Container, Flex } from '../components/ui';

const ContentWrapper = styled.div`
  padding: 6rem 0;
  background: white;
  min-height: calc(100vh - 80px);
`;

const ContentHeader = styled.div`
  max-width: 800px;
  margin: 0 auto 4rem;
  text-align: center;
`;

const SectionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 3.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  color: ${props => props.theme.colors.text};
  letter-spacing: -1px;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.5rem;
`;

const Terms = () => {
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <Container>
        <Button variant="outline" onClick={() => navigate('/')} style={{ marginBottom: '4rem' }}>
           <ArrowLeft size={16} style={{ marginRight: 8 }} /> Return Home
        </Button>

        <ContentHeader>
           <div style={{ background: '#0077b615', color: '#0077b6', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <Scale size={28} />
           </div>
           <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1rem' }}>Terms of Service</h1>
           <p style={{ color: '#888', fontWeight: 600 }}>Last Updated: August 2026</p>
        </ContentHeader>

        <SectionContainer>
           <Section>
              <SectionTitle>1. Executive Summary</SectionTitle>
              <Paragraph>
                 By accessing the StartupFund B2B SaaS platform, you acknowledge that you are entering a professional ecosystem designed for collaborative innovation and capital deployment. All entities must adhere to strict verification standards.
              </Paragraph>
           </Section>

           <Section>
              <SectionTitle>2. Platform Governance</SectionTitle>
              <Paragraph>
                 StartupFund provides infrastructure for startups, investors, and MNCs. We maintain a zero-tolerance policy towards fraudulent activity, misleading financial data, or breach of professional conduct.
              </Paragraph>
              <Card style={{ padding: '2rem', background: '#fafafa', border: 'none' }}>
                 <Flex gap="1rem">
                    <ShieldCheck size={24} style={{ color: '#2f855a' }} />
                    <p style={{ fontSize: '0.95rem', color: '#666', fontWeight: 600 }}>
                       All financial transactions and equity transfers within the ecosystem are subject to automated compliance auditing.
                    </p>
                 </Flex>
              </Card>
           </Section>

           <Section>
              <SectionTitle>3. Professional Data Isolation</SectionTitle>
              <Paragraph>
                 User data is managed under high-security protocols. Private Space communications and shared documents are isolated per session to prevent cross-account data leaks.
              </Paragraph>
           </Section>

           <Section>
              <SectionTitle>4. Compliance & Verification</SectionTitle>
              <Paragraph>
                 All users must undergo KYC (Know Your Customer) verification. Use of the platform for money laundering, spamming, or intellectual property theft results in immediate account termination and legal referrals.
              </Paragraph>
           </Section>

           <Card style={{ padding: '3rem', textAlign: 'center', marginTop: '6rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Questions regarding these terms?</h3>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Our compliance team is ready to assist you with any legal or operational queries.</p>
              <Button onClick={() => navigate('/about')}>Contact Compliance Team</Button>
           </Card>
        </SectionContainer>
      </Container>
    </ContentWrapper>
  );
};

export default Terms;
