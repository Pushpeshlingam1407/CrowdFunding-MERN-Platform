import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowRight,
  Briefcase,
  DollarSign,
  Target,
} from "lucide-react";
import { Button, Card, Container, Flex, Grid } from "./ui";
import { toast } from "react-hot-toast";
import { investmentAPI } from "../services/api";
import "./Portfolio.css";

const Portfolio = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    averageReturn: 0,
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await investmentAPI.getUserInvestments();

      const data = response.data;
      setInvestments(data.success ? data.investments : []);

      // Calculate stats
      const totalInvested = data.investments.reduce((sum, inv) => {
        return inv.status === "completed" ? sum + inv.amount : sum;
      }, 0);

      const activeInvestments = data.investments.filter(
        (inv) => inv.status === "completed",
      ).length;

      setStats({
        totalInvested,
        activeInvestments,
        averageReturn:
          activeInvestments > 0
            ? Math.round(totalInvested / activeInvestments)
            : 0,
      });
    } catch (error) {
      toast.error("Failed to load your investments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="portfolio-wrapper">
        <Container>
          <div className="portfolio-loading">
            <p>Loading your portfolio...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="portfolio-wrapper">
      <Container>
        <div className="portfolio-header">
          <h1>Investment Portfolio</h1>
          <p>Track your investments across all campaigns</p>
        </div>

        <Grid cols={3} gap="1.5rem" className="portfolio-stats-grid">
          <Card className="portfolio-stat-card">
            <DollarSign />
            <div className="portfolio-stat-content">
              <h3>Total Invested</h3>
              <p>₹{stats.totalInvested.toLocaleString()}</p>
            </div>
          </Card>
          <Card className="portfolio-stat-card">
            <Briefcase />
            <div className="portfolio-stat-content">
              <h3>Active Investments</h3>
              <p>{stats.activeInvestments}</p>
            </div>
          </Card>
          <Card className="portfolio-stat-card">
            <TrendingUp />
            <div className="portfolio-stat-content">
              <h3>Average Investment</h3>
              <p>₹{stats.averageReturn.toLocaleString()}</p>
            </div>
          </Card>
        </Grid>

        {investments.length === 0 ? (
          <div className="portfolio-empty-state">
            <Briefcase />
            <h3>No Investments Yet</h3>
            <p>
              Start building your investment portfolio. Explore our campaigns
              and invest in startups.
            </p>
            <Button onClick={() => navigate("/campaigns")}>
              Explore Campaigns
            </Button>
          </div>
        ) : (
          <>
            <h2 className="portfolio-section-title">Your Investments</h2>
            <div className="portfolio-investment-list">
              {investments.map((investment, index) => (
                <motion.div
                  className="portfolio-investment-card"
                  key={investment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="portfolio-project-image">
                    <img
                      src={
                        investment.project?.image?.startsWith("http")
                          ? investment.project.image
                          : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://localhost:5000"}${investment.project?.image}`
                      }
                      alt={investment.project?.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                  </div>

                  <div className="portfolio-project-info">
                    <h3>{investment.project?.title}</h3>
                    <p>
                      {investment.project?.description?.substring(0, 100)}...
                    </p>
                    <span className="category">Technology</span>
                  </div>

                  <div className="portfolio-investment-amount">
                    <h4>Amount</h4>
                    <p>₹{investment.amount.toLocaleString()}</p>
                  </div>

                  <div className="portfolio-investment-status">
                    <h4>Status</h4>
                    <span className={`status-${investment.status}`}>
                      {investment.status.charAt(0).toUpperCase() +
                        investment.status.slice(1)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/projects/${investment.project?._id}`)
                    }
                  >
                    View <ArrowRight size={16} className="icon-ml" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Portfolio;
