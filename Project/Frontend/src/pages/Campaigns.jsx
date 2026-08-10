import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Flex, Input } from "../components/ui";
import { projectAPI } from "../services/api";
import "./Campaigns.css";





































const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await projectAPI.getProjects();
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(campaigns.map((c) => c.category).filter(Boolean))),
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesCategory =
      selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="campaigns-page-header">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="page-heading">Campaign Marketplace</h1>
            <p className="page-subtitle">
              Browse active fundraising rounds and support emerging startups.
            </p>
          </motion.div>
        </Container>
      </div>

      <div className="campaigns-filter-section">
        <Container>
          <Flex justify="space-between" align="center" wrap="wrap" gap="1rem">
            <Flex gap="1.5rem" align="center" wrap="wrap">
              <div className="campaigns-search-wrapper">
                <Search size={18} />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="campaigns-segmented-control">
                {categories.map((cat) => (
                  <button
                    className={`campaigns-segment-button ${selectedCategory === cat ? 'active' : ''}`}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Flex>
            <div className="campaign-count">
              Showing {filteredCampaigns.length} campaigns
            </div>
          </Flex>
        </Container>
      </div>

      <Container>
        <div className="campaigns-grid">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card className="campaign-card campaign-skeleton-card" key={i}>
                    <div className="campaign-skeleton-img" />
                    <div className="campaign-skeleton-line-sm" />
                    <div className="campaign-skeleton-line-md" />
                    <div className="campaign-skeleton-line-lg" />
                  </Card>
                ))
            : filteredCampaigns.map((campaign) => {
                const progress = Math.min(
                  100,
                  (campaign.currentAmount / campaign.targetAmount) * 100,
                );
                const daysLeft = calculateDaysLeft(campaign.endDate);
                const isLocked = daysLeft === 0;

                return (
                  <Card className="campaign-card" key={campaign._id}>
                    <div className="campaign-image-wrapper">
                      <img
                        src={
                          campaign.image?.startsWith("http")
                            ? campaign.image
                            : `http://localhost:5000${campaign.image}`
                        }
                        alt={campaign.title}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2070";
                        }}
                      />
                      <span className="campaign-badge">
                        {isLocked ? (
                          <CheckCircle2
                            size={12}
                            className="campaign-badge-icon"
                          />
                        ) : (
                          <Clock size={12} className="campaign-badge-icon" />
                        )}
                        {isLocked ? "COMPLETED" : `${daysLeft} DAYS LEFT`}
                      </span>
                    </div>
                    <div className="campaign-content">
                      <span className="campaign-category">{campaign.category}</span>
                      <h3 className="campaign-title">{campaign.title}</h3>
                      <p className="campaign-description">{campaign.description}</p>

                      <div className="campaign-progress-info">
                        <Flex
                          justify="space-between"
                          className="campaign-progress-row"
                        >
                          <span className="campaign-funded">
                            {progress.toFixed(1)}% funded
                          </span>
                          <span className="campaign-target">
                            Target: ₹
                            {campaign.targetAmount.toLocaleString("en-IN")}
                          </span>
                        </Flex>
                        <div className="campaign-progress-bar-base">
                          <div className="campaign-progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="campaign-stats-grid">
                        <div className="campaign-stat-item">
                          <Users size={16} className="campaign-stat-icon" />
                          <span>
                            {campaign.creator?.name || "Vetted Startup"}
                          </span>
                        </div>
                        <div className="campaign-stat-item campaign-equity-stat">
                          <span>Equity: {campaign.equity}%</span>
                        </div>
                      </div>

                      <Link
                        to={`/projects/${campaign._id}`}
                        className="campaign-link-wrapper"
                      >
                        <Button className="btn-primary-dark btn-full">
                          View Portfolio{" "}
                          <ArrowRight size={18} className="icon-ml" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
        </div>
      </Container>
    </>
  );
};

export default Campaigns;
