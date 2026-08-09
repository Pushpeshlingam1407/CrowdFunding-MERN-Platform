import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  Mail,
  MessageSquare,
  ShieldCheck,
  Plus,
  Rocket,
  CheckCircle2,
  Clock,
  History,
  TrendingUp,
  Users,
  Star,
  Flag,
  ThumbsUp,
  Heart,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Card, Container, Flex, Grid, Input } from "../components/ui";
import StarRating from "../components/ui/StarRating";
import ComplaintBox from "../components/ui/ComplaintBox";
import useAuthStore from "../store/authStore";
import { b2bAPI, userAPI, projectAPI } from "../services/api";
import "./CompanyProfile.css";

const ProfileWrapper = styled.div`
  padding: 4rem 0;
  background-color: #fbf9f6;
  background-image: radial-gradient(#e3e0d8 1px, transparent 1px);
  background-size: 32px 32px;
  min-height: calc(100vh - 80px);
`;

const ProfileHeader = styled(Card)`
  padding: 3rem;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #e3e0d8;
  margin-bottom: 2rem;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.015);
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.05);
  color: #191919;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  margin-right: 2rem;
  overflow: hidden;
  border: 1px solid #e3e0d8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Badge = styled.span`
  padding: 0.35rem 0.8rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.04);
  color: #6e6e73;
  margin-bottom: 0.5rem;
  display: inline-block;
  border: 1px solid #e3e0d8;
`;

const ReviewCard = styled(Card)`
  margin-bottom: 1.5rem;
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid #e3e0d8;
  background: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.01);
`;

const ServiceTag = styled.span`
  padding: 0.35rem 0.8rem;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 99px;
  border: 1px solid #e3e0d8;
  font-size: 0.8rem;
  font-weight: 700;
  color: #191919;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #dcdad2;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #191919;
  }
`;

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showComplaintBox, setShowComplaintBox] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    appreciation: "",
    feedback: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      const profileRes = await b2bAPI.getCompany(id);
      // Flatten: user fields (name,email,role) + company fields (bio,portfolio,branding,stars…)
      const companyData = profileRes.data;
      const merged = { ...companyData.user, ...companyData };
      setProfile(merged);

      // Fetch this creator's approved campaigns
      try {
        const userId = companyData.user?._id || id;
        const allRes = await fetch(`http://localhost:5000/api/projects`);
        const allData = await allRes.json();
        const userProjects = Array.isArray(allData)
          ? allData.filter(
              (p) => p.creator?._id === userId || p.creator === userId,
            )
          : [];
        setProjects(userProjects);
      } catch (e) {
        console.warn("Could not load projects:", e);
      }

      const reviewsRes = await b2bAPI.getReviews(id);
      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    try {
      await b2bAPI.postReview({ companyId: id, ...newReview });
      toast.success("Review posted successfully!");
      setShowReviewModal(false);
      fetchProfileData(); // Refresh reviews
    } catch (error) {
      toast.error("Failed to post review");
    }
  };

  if (loading)
    return (
      <ProfileWrapper>
        <Container>
          <div className="profile-loading-wrapper">
            <div className="profile-loading-skeleton" />
          </div>
        </Container>
      </ProfileWrapper>
    );
  if (!profile)
    return <div className="profile-not-found">Profile Not Found</div>;

  return (
    <ProfileWrapper>
      <Container>
        <ProfileHeader>
          <Flex align="flex-start" wrap="wrap" gap="2rem">
            <Avatar>{profile.name.charAt(0)}</Avatar>
            <div className="profile-header-content">
              <Badge>{profile.role}</Badge>
              <h1 className="profile-name">
                {profile.companyName || profile.name}
              </h1>
              {profile.branding?.slogan && (
                <p className="profile-slogan">"{profile.branding.slogan}"</p>
              )}
              <Flex gap="1.5rem" className="profile-info-flex">
                <Flex gap="0.5rem">
                  <Globe size={18} /> {profile.companyWebsite || "N/A"}
                </Flex>
                <Flex gap="0.5rem">
                  <Mail size={18} /> {profile.email}
                </Flex>
                <Flex gap="0.5rem">
                  <ShieldCheck size={18} className="icon-success" /> Verified
                  Member
                </Flex>
              </Flex>
              <Flex gap="1rem" wrap="wrap">
                <Button
                  onClick={() => navigate(`/messages/${id}`)}
                  className="btn-message"
                >
                  <MessageSquare size={18} className="icon-mr" /> Message /
                  Connect
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReviewModal(true)}
                  className="btn-outline-subtle"
                >
                  <Star size={18} className="icon-mr" /> Leave a Review
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline-danger"
                  onClick={() => setShowComplaintBox(true)}
                >
                  <Flag size={18} />
                </Button>
              </Flex>
            </div>
            <div className="profile-rating-section">
              <h2 className="profile-rating-value">
                {profile.stars?.toFixed(1) || "0.0"}
              </h2>
              <StarRating rating={Math.round(profile.stars || 0)} readonly />
              <p className="profile-reviews-count">
                {profile.reviewsCount || 0} Collaborative Reviews
              </p>
            </div>
          </Flex>

          {/* Dynamic Trust Bar */}
          <Grid cols={4} gap="1rem" className="trust-bar-grid">
            <Flex
              gap="1rem"
              direction="column"
              align="center"
              className="trust-bar-item"
            >
              <Users size={24} className="icon-primary" />
              <div>
                <h4 className="trust-bar-value">
                  {profile.dynamicMetrics?.trustedByCount || 0}+
                </h4>
                <p className="trust-bar-label">Trusted by Entities</p>
              </div>
            </Flex>
            <Flex
              gap="1rem"
              direction="column"
              align="center"
              className="trust-bar-item"
            >
              <TrendingUp size={24} className="icon-success" />
              <div>
                <h4 className="trust-bar-value">
                  {profile.dynamicMetrics?.collaborationsCount || 0}
                </h4>
                <p className="trust-bar-label">Active Collaborations</p>
              </div>
            </Flex>
            <Flex
              gap="1rem"
              direction="column"
              align="center"
              className="trust-bar-item"
            >
              <Briefcase size={24} className="icon-primary" />
              <div>
                <h4 className="trust-bar-value">
                  {profile.dynamicMetrics?.projectsCount || 0}
                </h4>
                <p className="trust-bar-label">Platform Ventures</p>
              </div>
            </Flex>
            <Flex
              gap="1rem"
              direction="column"
              align="center"
              className="trust-bar-item"
            >
              <ShieldCheck size={24} className="icon-success" />
              <div>
                <h4 className="trust-bar-value">100%</h4>
                <p className="trust-bar-label">Security Score</p>
              </div>
            </Flex>
          </Grid>
          <ComplaintBox
            isOpen={showComplaintBox}
            onClose={() => setShowComplaintBox(false)}
            targetCompanyId={id}
          />
        </ProfileHeader>

        <AnimatePresence>
          {showReviewModal && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
            >
              <Card
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="review-modal-card"
              >
                <h2 className="review-modal-title">Professional Review</h2>
                <p className="review-modal-subtitle">
                  Your feedback helps maintain high standards in our
                  crowdfunding ecosystem.
                </p>

                <form onSubmit={handlePostReview}>
                  <label className="form-label-small">Rating</label>
                  <div className="star-rating-wrapper">
                    <StarRating
                      rating={newReview.rating}
                      onChange={(r) =>
                        setNewReview({ ...newReview, rating: r })
                      }
                    />
                  </div>

                  <label className="form-label-small">Comment</label>
                  <TextArea
                    placeholder="General experience working with this company..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    required
                  />

                  <Grid cols={2} gap="1rem">
                    <div>
                      <label className="form-label-small">Appreciation</label>
                      <Input
                        placeholder="What did they do well?"
                        value={newReview.appreciation}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            appreciation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="form-label-small">Feedback</label>
                      <Input
                        placeholder="Room for improvement?"
                        value={newReview.feedback}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            feedback: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Grid>

                  <Flex gap="1rem" className="review-modal-actions">
                    <Button
                      variant="outline"
                      type="button"
                      className="btn-flex-1 btn-outline-subtle"
                      onClick={() => setShowReviewModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="btn-flex-2 btn-message">
                      Submit Review
                    </Button>
                  </Flex>
                </form>
              </Card>
            </ModalOverlay>
          )}
        </AnimatePresence>

        <Grid cols="2fr 1fr" gap="2rem">
          <div>
            <Card className="about-card">
              <h3 className="section-title-md">About the Company</h3>
              <p className="about-bio">
                {profile.bio ||
                  "This company has not provided a detailed description yet."}
              </p>

              <h4 className="subsection-title">Services Offered</h4>
              <Flex gap="0.75rem" wrap="wrap">
                {profile.services && profile.services.length > 0 ? (
                  profile.services.map((service, i) => (
                    <ServiceTag key={i}>{service}</ServiceTag>
                  ))
                ) : (
                  <p className="no-services-text">No services specified.</p>
                )}
              </Flex>
            </Card>

            {/* Active Campaigns */}
            {projects.length > 0 && (
              <>
                <h3 className="section-heading-sm">Active Campaigns</h3>
                <div className="active-campaigns-list">
                  {projects.map((proj) => {
                    const progress = Math.min(
                      100,
                      ((proj.currentAmount || 0) / proj.targetAmount) * 100,
                    );
                    return (
                      <Card
                        key={proj._id}
                        className="campaign-card-inline"
                        onClick={() => navigate(`/projects/${proj._id}`)}
                      >
                        <img
                          src={
                            proj.image?.startsWith("http")
                              ? proj.image
                              : `http://localhost:5000${proj.image}`
                          }
                          alt={proj.title}
                          className="campaign-card-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="flex-grow-1">
                          <Flex
                            justify="space-between"
                            align="flex-start"
                            className="campaign-title-row"
                          >
                            <h4 className="campaign-title">{proj.title}</h4>
                            <span
                              style={{
                                background:
                                  proj.status === "approved"
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : "rgba(245, 158, 11, 0.1)",
                                color:
                                  proj.status === "approved"
                                    ? "#10b981"
                                    : "#f59e0b",
                              }}
                              className="campaign-status-badge"
                            >
                              {proj.status}
                            </span>
                          </Flex>
                          <p className="campaign-category">
                            {proj.category} ·{" "}
                            <span className="campaign-goal">
                              ₹{proj.targetAmount?.toLocaleString("en-IN")} goal
                            </span>
                          </p>
                          <div className="progress-track-sm">
                            <div
                              style={{
                                width: `${progress}%`,
                              }}
                              className="progress-fill-sm"
                            />
                          </div>
                          <p className="campaign-stats">
                            <span className="font-mono">
                              ₹
                              {(proj.currentAmount || 0).toLocaleString(
                                "en-IN",
                              )}
                            </span>{" "}
                            raised ·{" "}
                            <span className="font-mono">
                              {progress.toFixed(0)}%
                            </span>
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            <h3 className="section-heading-sm">Legit Works & Portfolio</h3>
            <Grid cols={2} gap="1.5rem" className="portfolio-grid">
              {profile.portfolio?.map((work, i) => (
                <Card key={i} className="portfolio-card">
                  <div className="portfolio-img-container">
                    {work.image ? (
                      <img src={work.image} className="portfolio-img" />
                    ) : (
                      <Briefcase size={48} className="portfolio-icon-fade" />
                    )}
                  </div>
                  <div className="portfolio-content">
                    <h4 className="portfolio-title">{work.title}</h4>
                    <p className="portfolio-desc">{work.description}</p>
                    {work.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(work.link, "_blank")}
                        className="btn-outline-subtle"
                      >
                        View Project{" "}
                        <ExternalLink size={14} className="icon-ml" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              {(!profile.portfolio || profile.portfolio.length === 0) && (
                <p className="no-portfolio-text">
                  No portfolio items uploaded yet.
                </p>
              )}
            </Grid>

            <h3 className="section-heading-sm">Collaborator Feedbacks</h3>
            {reviews.map((review) => (
              <ReviewCard key={review._id}>
                <Flex justify="space-between" className="review-header-flex">
                  <Flex gap="1rem" align="center">
                    <div className="reviewer-avatar">
                      {review.author?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h4 className="reviewer-name">{review.author?.name}</h4>
                      <p className="reviewer-date">
                        {new Date(review.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </Flex>
                  <StarRating rating={review.rating} readonly />
                </Flex>
                <p className="review-comment">{review.comment}</p>
                <Grid cols={2} gap="1rem">
                  <div className="review-appreciation-box">
                    <Flex gap="0.5rem" className="review-box-title-success">
                      <ThumbsUp size={14} /> APPRECIATION
                    </Flex>
                    <p className="review-box-text-success">
                      {review.appreciation || "N/A"}
                    </p>
                  </div>
                  <div className="review-feedback-box">
                    <Flex gap="0.5rem" className="review-box-title-danger">
                      <Heart size={14} /> FEEDBACK
                    </Flex>
                    <p className="review-box-text-danger">
                      {review.feedback || "N/A"}
                    </p>
                  </div>
                </Grid>
              </ReviewCard>
            ))}
            {reviews.length === 0 && (
              <p className="no-reviews-text">
                No reviews yet. Be the first to leave one!
              </p>
            )}
          </div>

          <div>
            <Card className="summary-card">
              <h3 className="summary-title">Review Summary</h3>
              <div className="summary-chart-container">
                {[5, 4, 3, 2, 1].map((star) => (
                  <Flex key={star} gap="1rem" className="star-row">
                    <span className="star-label">{star} star</span>
                    <div className="star-track">
                      <div
                        style={{
                          width: star === 5 ? "80%" : "5%",
                        }}
                        className="star-fill"
                      />
                    </div>
                  </Flex>
                ))}
              </div>
              <div className="summary-footer">
                <p className="summary-policy-text">
                  Our operations are governed by verified crowdfunding
                  protocols.
                </p>
                <Button
                  variant="outline"
                  className="btn-full-width btn-outline-subtle"
                  onClick={() => navigate("/terms")}
                >
                  View Policies
                </Button>
              </div>
            </Card>

            <Card className="journey-card">
              <h3 className="summary-title">Professional Journey</h3>
              <div className="journey-timeline">
                {profile.activityLog
                  ?.slice()
                  .reverse()
                  .map((log, i) => (
                    <div key={i} className="journey-item">
                      <div
                        style={{
                          background:
                            log.type === "automatic" ? "#0071e3" : "#6e6e73",
                        }}
                        className="journey-dot"
                      />
                      <h5 className="journey-title">{log.milestone}</h5>
                      <p className="journey-date">
                        {new Date(log.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </Grid>
      </Container>
    </ProfileWrapper>
  );
};

export default CompanyProfile;
