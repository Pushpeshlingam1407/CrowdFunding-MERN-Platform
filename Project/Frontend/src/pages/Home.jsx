import React from "react";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Flex, Grid, Card } from "../components/ui";
import useAuthStore from "../store/authStore";
import "./Home.css";



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
      <section className="home-hero-section">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="home-badge">Welcome to StartupFund</div>
            <motion.h1 className="home-title">
              Empowering Startups to <br /> <span>Raise Capital</span> & Scale
            </motion.h1>
            <motion.p className="home-subtitle">
              Launch campaigns, discover high-potential startups, and manage
              your investment portfolio all in one platform.
            </motion.p>
            <Flex justify="center" gap="1rem">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="btn-primary-dark"
              >
                {user ? "Go to Dashboard" : "Join the Network"}{" "}
                <ArrowRight size={18} className="icon-ml" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/campaigns")}
                className="btn-outline-subtle"
              >
                Explore Campaigns
              </Button>
            </Flex>
          </motion.div>
        </Container>
      </section>

      <section className="home-features-section">
        <Container>
          <div className="home-section-header">
            <h2>One Platform, Endless Possibilities</h2>
            <p>Everything you need to scale your startup or portfolio.</p>
          </div>
          <Grid cols={3}>
            <Card className="home-styled-card">
              <div className="home-feature-icon">
                <Zap size={24} />
              </div>
              <h3 className="home-feature-title">Launch Campaigns</h3>
              <p className="home-feature-text">
                Raise capital quickly with transparent equity offerings and
                attract the right investors for your vision.
              </p>
            </Card>
            <Card className="home-styled-card">
              <div className="home-feature-icon">
                <Target size={24} />
              </div>
              <h3 className="home-feature-title">Discover Opportunities</h3>
              <p className="home-feature-text">
                Browse verified startups, review comprehensive metrics, and
                invest in high-potential ventures.
              </p>
            </Card>
            <Card className="home-styled-card">
              <div className="home-feature-icon">
                <Briefcase size={24} />
              </div>
              <h3 className="home-feature-title">Manage Portfolio</h3>
              <p className="home-feature-text">
                Track your investments, view campaign progress, and securely
                monitor your equity in real-time.
              </p>
            </Card>
          </Grid>
        </Container>
      </section>

      <section className="home-cta-section">
        <Container>
          <motion.div className="home-cta-panel"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Start Your Fundraising Journey</h2>
            <p>
              Create your account today and connect with investors who believe
              in your vision.
            </p>
            <Button
              className="home-cta-btn"
              size="lg"
              onClick={handleGetStarted}
            >
              Get Started for Free
            </Button>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default Home;
