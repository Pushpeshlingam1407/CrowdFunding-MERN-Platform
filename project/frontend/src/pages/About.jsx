import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  Cpu,
  Globe,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import { Button, Card, Container, Flex, Grid } from "../components/ui";

const AboutWrapper = styled.div`
  padding: 6rem 0;
  background: white;
  min-height: calc(100vh - 80px);
`;

const HeroSection = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 6rem;
`;

const Badge = styled.span`
  background: ${(props) => props.theme.colors.primary}10;
  color: ${(props) => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  display: inline-block;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -3px;
  line-height: 1;
  margin-bottom: 2rem;
  color: ${(props) => props.theme.colors.text};
`;

const FeatureCard = styled(Card)`
  padding: 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 24px;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.primary}10;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <AboutWrapper>
      <Container>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          style={{ marginBottom: "4rem" }}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Return Home
        </Button>

        <HeroSection>
          <Badge>The Ecosystem Ledger</Badge>
          <Title>Powering the next generation of B2B SaaS ventures.</Title>
          <p style={{ fontSize: "1.25rem", color: "#666", lineHeight: "1.6" }}>
            StartupFund is the definitive infrastructure for startups,
            professional investors, MNCs, and enterprise employees to connect,
            collaborate, and capitalize on innovation.
          </p>
        </HeroSection>

        <Grid cols={3} gap="2rem" style={{ marginBottom: "6rem" }}>
          <FeatureCard>
            <IconBox>
              <Target size={24} />
            </IconBox>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Precision Funding
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              We bridge the gap between high-potential startups and
              institutional capital through a secured, multi-tier vetting
              process.
            </p>
          </FeatureCard>
          <FeatureCard>
            <IconBox>
              <Zap size={24} />
            </IconBox>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>MNC Synergy</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Enterprise entities can find agile services and talent directly
              from the startup ecosystem, fostering rapid integration.
            </p>
          </FeatureCard>
          <FeatureCard>
            <IconBox>
              <ShieldCheck size={24} />
            </IconBox>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Secure Space
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Private collaboration rooms and encrypted document sharing ensure
              your intellectual property remains protected.
            </p>
          </FeatureCard>
        </Grid>

        <Card
          style={{
            padding: "4rem",
            background: "#fafafa",
            borderRadius: "32px",
          }}
        >
          <Grid cols={2} gap="4rem" align="center">
            <div>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                  letterSpacing: "-1.5px",
                }}
              >
                Founded on Professional Integrity.
              </h2>
              <p
                style={{
                  color: "#666",
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}
              >
                Established in 2024, StartupFund was built by a team of
                ecosystem architects who recognized the friction in B2B
                collaboration. Our mission is to accelerate the global
                transition to a decentralized, service-driven economy.
              </p>
              <Flex gap="1.5rem">
                <div style={{ textAlign: "center" }}>
                  <h4 style={{ fontSize: "1.75rem", fontWeight: 800 }}>12k+</h4>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#999",
                      textTransform: "uppercase",
                    }}
                  >
                    Active Members
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
                    $200M+
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#999",
                      textTransform: "uppercase",
                    }}
                  >
                    Volume Managed
                  </p>
                </div>
              </Flex>
            </div>
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "24px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
              }}
            >
              <Flex direction="column" gap="1.5rem">
                <Flex gap="1rem">
                  <Star size={20} style={{ color: "#ffc107" }} />
                  <p style={{ fontStyle: "italic", color: "#444" }}>
                    "StartupFund redefined how we source enterprise solutions.
                    The private space features are a game changer."
                  </p>
                </Flex>
                <hr
                  style={{
                    width: "100%",
                    border: "none",
                    borderTop: "1px solid #eee",
                  }}
                />
                <Flex gap="1rem">
                  <Users size={40} style={{ color: "#0077b6" }} />
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                      Sarah Jenkins
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#999" }}>
                      Director of Innovation, MNC Global
                    </p>
                  </div>
                </Flex>
              </Flex>
            </div>
          </Grid>
        </Card>
      </Container>
    </AboutWrapper>
  );
};

export default About;
