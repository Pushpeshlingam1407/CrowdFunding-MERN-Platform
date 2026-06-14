import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Target,
  Users,
  Shield,
  Briefcase,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Flex, Grid, Card } from "../components/ui";
import useAuthStore from "../store/authStore";

const HeroSection = styled.section`
  padding: 8rem 0;
  text-align: center;
  background: radial-gradient(circle at top, #0077b60a 0%, #ffffff 100%);
`;

const Badge = styled.div`
  display: inline-flex;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.colors.primary}15;
  color: ${(props) => props.theme.colors.primary};
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
  color: ${(props) => props.theme.colors.text};
  font-family: ${(props) => props.theme.fonts.serif};

  span {
    color: ${(props) => props.theme.colors.primary};
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
  font-family: ${(props) => props.theme.fonts.serif};
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.primary}10;
  color: ${(props) => props.theme.colors.primary};
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
      navigate("/dashboard");
    } else {
      navigate("/register");
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
            <Badge>Welcome to StartupFund</Badge>
            <Title>
              Empowering Startups to <br /> <span>Raise Capital</span> & Scale
            </Title>
            <Subtitle>
              Launch campaigns, discover high-potential startups, and manage your investment portfolio all in one platform.
            </Subtitle>
            <Flex justify="center" gap="1rem">
              <Button size="lg" onClick={handleGetStarted}>
                {user ? "Go to Dashboard" : "Join the Network"}{" "}
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/campaigns")}
              >
                Explore Campaigns
              </Button>
            </Flex>
          </motion.div>
        </Container>
      </HeroSection>

      <section style={{ padding: "6rem 0" }}>
        <Container>
          <SectionHeader>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                marginBottom: "1rem",
                fontFamily: '"Crimson Pro", Lora, Georgia, serif',
              }}
            >
              One Platform, Endless Possibilities
            </h2>
            <p style={{ color: "#666", fontSize: "1.1rem", fontFamily: '"Crimson Pro", Lora, Georgia, serif' }}>
              Everything you need to scale your startup or portfolio.
            </p>
          </SectionHeader>
          <Grid cols={3}>
            <Card>
              <FeatureIcon>
                <Zap size={24} />
              </FeatureIcon>
              <FeatureTitle>Launch Campaigns</FeatureTitle>
              <FeatureText>
                Raise capital quickly with transparent equity offerings and attract the right investors for your vision.
              </FeatureText>
            </Card>
            <Card>
              <FeatureIcon>
                <Target size={24} />
              </FeatureIcon>
              <FeatureTitle>Discover Opportunities</FeatureTitle>
              <FeatureText>
                Browse verified startups, review comprehensive metrics, and invest in high-potential ventures.
              </FeatureText>
            </Card>
            <Card>
              <FeatureIcon>
                <Briefcase size={24} />
              </FeatureIcon>
              <FeatureTitle>Manage Portfolio</FeatureTitle>
              <FeatureText>
                Track your investments, view campaign progress, and securely monitor your equity in real-time.
              </FeatureText>
            </Card>
          </Grid>
        </Container>
      </section>

      <section style={{ padding: "6rem 0", background: "#fafafa" }}>
        <Container>
          <Card
            style={{
              background: "#0077b6",
              color: "#fff",
              textAlign: "center",
              padding: "4rem",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
                fontFamily: '"Crimson Pro", Lora, Georgia, serif',
              }}
            >
              Start Your Fundraising Journey
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                marginBottom: "2.5rem",
                opacity: 0.9,
                fontFamily: '"Crimson Pro", Lora, Georgia, serif',
              }}
            >
              Create your account today and connect with investors who believe in your vision.
            </p>
            <Button
              style={{ background: "#fff", color: "#0077b6" }}
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
