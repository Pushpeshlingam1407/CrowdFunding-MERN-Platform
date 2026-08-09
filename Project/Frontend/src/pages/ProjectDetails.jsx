import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Share2,
  Flag,
  ShieldCheck,
  Lock,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Card, Container, Flex, Grid } from "../components/ui";
import InvestmentModal from "../components/InvestmentModal";
import PaymentModal from "../components/PaymentModal";
import useAuthStore from "../store/authStore";
import { projectAPI } from "../services/api";
import "./ProjectDetails.css";

/* ─── Styled Components ─────────────────────────────────────── */

const ProjectWrapper = styled.div`
  padding: 4rem 0;
  background-color: #fbf9f6;
  background-image: radial-gradient(#e3e0d8 1px, transparent 1px);
  background-size: 32px 32px;
  min-height: calc(100vh - 80px);
`;

const HeroCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: 24px;
  border: 1px solid #e3e0d8;
  background: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.015);
`;

const ImageContainer = styled.div`
  height: 400px;
  width: 100%;
  position: relative;
  border-bottom: 1px solid #e3e0d8;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatusOverlay = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.35rem 0.8rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 99px;
  font-weight: 800;
  font-size: 0.72rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) =>
    props.status === "completed"
      ? "#10b981"
      : props.locked
        ? "#ef4444"
        : "#0071e3"};
  border: 1px solid #e3e0d8;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProjectInfo = styled.div`
  padding: 3rem;
`;

const Category = styled.span`
  color: #6e6e73;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.75rem;
  margin-bottom: 1rem;
  display: block;
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: #191919;
  font-family: ${(props) => props.theme.fonts.serif};
`;

const Description = styled.p`
  font-size: 1.15rem;
  line-height: 1.7;
  color: #6e6e73;
  margin-bottom: 2.5rem;
  font-family: ${(props) => props.theme.fonts.serif};
`;

const SidebarCard = styled(Card)`
  position: sticky;
  top: 100px;
  padding: 2.5rem;
  border-radius: 24px;
  border: 1px solid #e3e0d8;
  background: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.015);
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 99px;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #10b981;
  width: ${(props) => props.progress}%;
  transition: width 0.6s ease;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e3e0d8;
  margin-top: 2rem;
`;

const CreatorDetails = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
    color: #191919;
  }
  p {
    font-size: 0.85rem;
    color: #6e6e73;
    font-weight: 500;
  }
`;

const GalleryTile = styled.div`
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #fbf9f6;
  border: 1px solid #e3e0d8;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover img {
    transform: scale(1.05);
  }

  .zoom-hint {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    opacity: 0;
  }
  &:hover .zoom-hint {
    background: rgba(0, 0, 0, 0.35);
    opacity: 1;
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxImg = styled(motion.img)`
  max-width: 90vw;
  max-height: 88vh;
  border-radius: 16px;
  object-fit: contain;
  box-shadow: 0 8px 60px rgba(0, 0, 0, 0.6);
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LightboxNav = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.side === "left" ? "left: 1.5rem;" : "right: 1.5rem;")}
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e3e0d8;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #86868b;
  &:hover {
    color: #191919;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: #6e6e73;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 2.25rem 0.75rem 1rem;
  border: 1px solid #dcdad2;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  background: #ffffff;
  margin-bottom: 1.25rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236e6e73%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 12px) center;
  outline: none;

  &:focus {
    border-color: #191919;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdad2;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #191919;
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdad2;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 1.25rem;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #191919;
  }
`;

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [project, setProject] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Investment / payment
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(null);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed

  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportData, setReportData] = useState({
    type: "fraud",
    subject: "",
    description: "",
  });

  /* ── Fetch ── */
  const fetchProjectDetails = async () => {
    try {
      const response = await projectAPI.getProject(id);
      setProject(response.data);
    } catch (error) {
      toast.error("Error loading project details");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/investments/project/${id}`,
      );
      const data = await res.json();
      if (data.success) {
        setInvestments(data.investments || []);
      }
    } catch (err) {
      console.error("Failed to fetch investments", err);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchInvestments();
  }, [id]);

  /* ── Lightbox keyboard nav ── */
  const images = project?.campaignImages || [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handle = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  /* ── Invest ── */
  const handleInvestClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to invest");
      navigate("/login");
      return;
    }
    if (project.status !== "approved" && project.status !== "active") {
      toast.error(
        "This campaign is not active yet and cannot receive investments.",
      );
      return;
    }
    setInvestmentModalOpen(true);
  };

  const handleInvestmentSubmit = (amount) => {
    setInvestmentAmount(amount);
    setInvestmentModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    await fetchProjectDetails();
    await fetchInvestments();
    toast.success("Investment successful! Check your portfolio for details.");
    navigate("/dashboard");
  };

  /* ── Report submit ── */
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to report");
      return;
    }
    if (!reportData.subject.trim() || !reportData.description.trim()) {
      toast.error("Please fill in subject and description");
      return;
    }
    setReportSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/complaints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: reportData.type,
            subject: reportData.subject,
            description: reportData.description,
            targetCompanyId: project.creator?._id,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to submit report");
      toast.success("Report submitted. Our compliance team will review it.");
      setReportOpen(false);
      setReportData({ type: "fraud", subject: "", description: "" });
    } catch (err) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  };

  /* ── Render ── */
  if (loading)
    return (
      <ProjectWrapper>
        <Container>
          <div className="project-loading-wrapper">
            <div className="project-loading-container">
              <div className="skeleton-hero" />
              <div className="skeleton-title" />
              <div className="skeleton-desc" />
            </div>
          </div>
        </Container>
      </ProjectWrapper>
    );
  if (!project)
    return <div className="project-not-found">Project Not Found</div>;

  const progress = Math.min(
    100,
    (project.currentAmount / project.targetAmount) * 100,
  );
  const isCreator =
    user?.id === project.creator?._id ||
    user?._id === project.creator?._id ||
    user?.email === project.creator?.email;
  const completedInvestments = investments.filter(
    (i) => i.status === "completed",
  );

  const getImgSrc = (img) =>
    img?.startsWith("http") ? img : `http://localhost:5000${img}`;
  const fallbackSrc =
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2070";

  return (
    <ProjectWrapper>
      <Container>
        <Button
          variant="outline"
          onClick={() => navigate("/campaigns")}
          className="btn-outline-subtle btn-back-margin"
        >
          <ArrowLeft size={16} className="icon-mr" /> Back to Marketplace
        </Button>

        <Grid cols="2fr 1fr" gap="2rem">
          {/* ── Left column ── */}
          <div>
            <HeroCard>
              <ImageContainer>
                <img
                  src={getImgSrc(project.image)}
                  alt={project.title}
                  onError={(e) => {
                    e.target.src = fallbackSrc;
                  }}
                />
                <StatusOverlay
                  locked={project.isLocked}
                  status={project.status}
                >
                  {project.status === "completed" ? (
                    <ShieldCheck size={16} />
                  ) : project.isLocked ? (
                    <Lock size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  {project.status === "completed"
                    ? "SUCCESSFULLY FUNDED"
                    : project.isLocked
                      ? "EXPIRED"
                      : "ACTIVE"}
                </StatusOverlay>
              </ImageContainer>

              <ProjectInfo>
                <Category>{project.category}</Category>
                <ProjectTitle>{project.title}</ProjectTitle>
                <Description>{project.description}</Description>

                <Grid cols={3} gap="2rem">
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span className="metric-label">Equity Offered</span>
                    <span className="metric-value">{project.equity}%</span>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span className="metric-label">Target Goal</span>
                    <span className="metric-value">
                      ₹{project.targetAmount.toLocaleString("en-IN")}
                    </span>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span className="metric-label">Min Investment</span>
                    <span className="metric-value">₹10,000</span>
                  </Flex>
                </Grid>

                <CreatorInfo>
                  <div className="creator-avatar-large">
                    {project.creator?.name?.charAt(0) || "?"}
                  </div>
                  <CreatorDetails>
                    <h4>{project.creator?.name}</h4>
                    <p>{project.creator?.role || "Verified Startup"}</p>
                  </CreatorDetails>
                  <Flex gap="1rem" className="creator-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/company/${project.creator?._id}`)
                      }
                      className="btn-outline-subtle"
                    >
                      Visit Profile
                    </Button>
                    {!isCreator && (
                      <Button size="sm" className="btn-primary-dark">
                        <MessageSquare size={16} className="icon-mr" /> Connect
                      </Button>
                    )}
                  </Flex>
                </CreatorInfo>
              </ProjectInfo>
            </HeroCard>

            {/* ── Campaign Gallery ── */}
            {images.length > 0 && (
              <div className="gallery-section">
                <h3 className="section-heading-sm">Campaign Gallery</h3>
                <div className="gallery-grid">
                  {images.map((img, i) => (
                    <GalleryTile key={i} onClick={() => setLightboxIndex(i)}>
                      <img
                        src={getImgSrc(img)}
                        alt={`Gallery ${i + 1}`}
                        onError={(e) => {
                          e.target.src = fallbackSrc;
                        }}
                      />
                      <div className="zoom-hint">
                        <ZoomIn size={28} color="white" />
                      </div>
                    </GalleryTile>
                  ))}
                </div>
              </div>
            )}

            {/* ── Investment History ── */}
            {completedInvestments.length > 0 && (
              <div className="investments-section">
                <h3 className="section-heading-sm">Recent Investments</h3>
                <div className="investments-list">
                  {completedInvestments.map((inv) => (
                    <Card key={inv._id} className="investment-card">
                      <Flex justify="space-between" align="center">
                        <Flex gap="1rem" align="center">
                          <div className="investor-avatar">
                            {inv.investor?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <h4 className="investor-name">
                              {inv.investor?.name || "Anonymous Investor"}
                            </h4>
                            <p className="investor-date">
                              {new Date(
                                inv.completedAt || inv.createdAt,
                              ).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </Flex>
                        <div className="investment-amount">
                          ₹{inv.amount.toLocaleString("en-IN")}
                        </div>
                      </Flex>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── Action bar ── */}
            <Flex gap="1rem" className="project-actions-bar">
              <Button variant="outline" className="btn-outline-subtle">
                <Share2 size={18} className="icon-mr" /> Share
              </Button>
              <Button
                variant="outline"
                className="btn-outline-danger"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Please login to report");
                    return;
                  }
                  setReportOpen(true);
                }}
              >
                <Flag size={18} className="icon-mr" /> Report / Flag
              </Button>
            </Flex>
          </div>

          {/* ── Sidebar ── */}
          <div>
            <SidebarCard>
              <h2 className="sidebar-heading">Funding Status</h2>
              <p className="sidebar-subheading">
                Join the pool of professional investors.
              </p>

              <Flex justify="space-between" align="center">
                <span className="raised-amount">
                  ₹{project.currentAmount.toLocaleString("en-IN")}
                </span>
                <span className="raised-percentage">
                  {progress.toFixed(1)}%
                </span>
              </Flex>
              <ProgressTrack>
                <ProgressFill progress={progress} />
              </ProgressTrack>

              <Grid cols={2} gap="1rem" className="sidebar-stats-grid">
                <Flex direction="column" align="flex-start">
                  <span className="stat-value">
                    ₹
                    {(
                      project.targetAmount - project.currentAmount
                    ).toLocaleString("en-IN")}
                  </span>
                  <span className="stat-label">Still Needed</span>
                </Flex>
                <Flex direction="column" align="flex-start">
                  <span className="stat-value">
                    {new Date(project.endDate) > new Date()
                      ? Math.ceil(
                          (new Date(project.endDate) - new Date()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : 0}
                  </span>
                  <span className="stat-label">Days Left</span>
                </Flex>
              </Grid>

              <Button
                size="lg"
                className="btn-invest-main"
                disabled={
                  project.isLocked ||
                  isCreator ||
                  project.status === "completed" ||
                  (project.status !== "approved" && project.status !== "active")
                }
                onClick={handleInvestClick}
              >
                {project.status === "completed"
                  ? "Campaign Fully Funded"
                  : project.isLocked
                    ? "Campaign Locked"
                    : project.status === "pending"
                      ? "Awaiting Admin Approval"
                      : project.status === "rejected"
                        ? "Campaign Rejected"
                        : project.status !== "approved" &&
                            project.status !== "active"
                          ? "Campaign Inactive"
                          : "Invest in Startup"}
              </Button>

              {isCreator && (
                <Button
                  variant="outline"
                  size="lg"
                  className="btn-manage-campaign btn-outline-subtle"
                  onClick={() => navigate(`/projects/${id}/edit`)}
                >
                  Manage Campaign
                </Button>
              )}
            </SidebarCard>
          </div>
        </Grid>
      </Container>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <LightboxClose onClick={closeLightbox}>
              <X size={22} />
            </LightboxClose>

            {images.length > 1 && (
              <LightboxNav
                side="left"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={24} />
              </LightboxNav>
            )}

            <LightboxImg
              key={lightboxIndex}
              src={getImgSrc(images[lightboxIndex])}
              alt={`Gallery ${lightboxIndex + 1}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.src = fallbackSrc;
              }}
            />

            {images.length > 1 && (
              <LightboxNav
                side="right"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={24} />
              </LightboxNav>
            )}

            {/* Counter */}
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {images.length}
            </div>
          </LightboxOverlay>
        )}
      </AnimatePresence>

      {/* ── Report Modal ── */}
      <AnimatePresence>
        {reportOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReportOpen(false)}
          >
            <ModalBox
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalClose onClick={() => setReportOpen(false)}>
                <X size={20} />
              </ModalClose>

              <Flex gap="0.75rem" className="report-header-flex">
                <div className="report-icon-box">
                  <AlertCircle size={20} color="#ef4444" />
                </div>
                <div>
                  <h2 className="report-heading">Report Campaign</h2>
                  <p className="report-subheading">
                    Your report goes directly to the compliance team.
                  </p>
                </div>
              </Flex>

              <form onSubmit={handleReportSubmit}>
                <Label>Issue Type</Label>
                <Select
                  value={reportData.type}
                  onChange={(e) =>
                    setReportData({ ...reportData, type: e.target.value })
                  }
                >
                  <option value="fraud">Fraud / Scam</option>
                  <option value="unpaid">Unpaid / Financial Dispute</option>
                  <option value="bug">Bug / Technical Issue</option>
                  <option value="other">Other</option>
                </Select>

                <Label>Subject</Label>
                <InputField
                  placeholder="Brief summary of the issue..."
                  value={reportData.subject}
                  onChange={(e) =>
                    setReportData({ ...reportData, subject: e.target.value })
                  }
                  required
                />

                <Label>Description</Label>
                <TextAreaField
                  placeholder="Describe the issue in detail. Include dates, amounts, or any evidence..."
                  value={reportData.description}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <Flex gap="1rem">
                  <Button
                    type="button"
                    variant="outline"
                    className="report-cancel-btn btn-outline-subtle"
                    onClick={() => setReportOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="report-submit-btn"
                    disabled={reportSubmitting}
                  >
                    <Send size={16} className="icon-mr" />
                    {reportSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </Flex>
              </form>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ── Investment Modals ── */}
      <AnimatePresence>
        <InvestmentModal
          isOpen={investmentModalOpen}
          onClose={() => setInvestmentModalOpen(false)}
          project={project}
          onProceed={handleInvestmentSubmit}
        />
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          project={project}
          projectId={id}
          amount={investmentAmount}
          onSuccess={handlePaymentSuccess}
        />
      </AnimatePresence>
    </ProjectWrapper>
  );
};

export default ProjectDetails;
