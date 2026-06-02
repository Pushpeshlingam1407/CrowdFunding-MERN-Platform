import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  EyeOff, 
  Database, 
  Activity 
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

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <Container>
        <Button variant="outline" onClick={() => navigate('/')} style={{ marginBottom: '4rem' }}>
           <ArrowLeft size={16} style={{ marginRight: 8 }} /> Return Home
        </Button>

        <ContentHeader>
           <div style={{ background: '#0077b615', color: '#0077b6', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <ShieldCheck size={28} />
           </div>
           <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1rem' }}>Ecosystem Privacy</h1>
           <p style={{ color: '#888', fontWeight: 600 }}>Governed by StartupFund Compliance Protocols</p>
        </ContentHeader>

        <SectionContainer>
            <Card style={{ padding: '3rem', border: 'none', background: '#fafafa', borderRadius: '24px', marginBottom: '4rem' }}>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>Our Commitment</h2>
               <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                  At StartupFund, we prioritize the confidentiality of professional ventures. Our infrastructure is designed for high-availability while maintaining absolute data isolation for each registered entity within the B2B SaaS ecosystem.
               </p>
            </Card>

            <Grid cols={2} gap="2rem" style={{ marginBottom: '4rem' }}>
               <div>
                  <Flex gap="0.75rem" style={{ color: '#0077b6', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                     <Lock size={18} /> Data Encryption
                  </Flex>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                     All document uploads and private space messages are encrypted at rest and in transit using industry-standard protocols.
                  </p>
               </div>
               <div>
                  <Flex gap="0.75rem" style={{ color: '#0077b6', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                     <EyeOff size={18} /> Zero Access Policy
                  </Flex>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                     Our employees cannot access your private collaboration spaces or encrypted documents without explicit compliance audit authorization.
                  </p>
               </div>
            </Grid>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Data Residency & Compliance</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
               User profiles and campaign metadata are stored across redundant global clusters to ensure 99.9% uptime. For audit purposes, we retain specific KYC data as required by the regulatory frameworks of the jurisdictions in which our B2B SaaS platform operates.
            </p>

            <Card style={{ padding: '3rem', textAlign: 'center', marginTop: '6rem', borderRadius: '32px', background: '#0077b6', color: 'white' }}>
               <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Your Identity, Secured.</h3>
               <p style={{ opacity: 0.9, marginBottom: '2.5rem' }}>The StartupFund terminal is designed for trust at every layer of the B2B SaaS ecosystem.</p>
               <Button onClick={() => navigate('/register')} style={{ background: 'white', color: '#0077b6' }}>Join the Ecosystem</Button>
            </Card>
        </SectionContainer>
      </Container>
    </ContentWrapper>
  );
};

export default Privacy;
