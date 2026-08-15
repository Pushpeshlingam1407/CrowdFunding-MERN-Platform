import React, { useState, useEffect, useCallback } from "react";

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
import { useAuth } from "../context/AuthContext";
import { projectAPI } from "../services/api";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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
      <div className="project-details-wrapper">
        <Container>
          <div className="project-loading-wrapper">
            <div className="project-loading-container">
              <div className="skeleton-hero" />
              <div className="skeleton-title" />
              <div className="skeleton-desc" />
            </div>
          </div>
        </Container>
      </div>
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
    <div className="project-details-wrapper">
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
            <Card className="project-hero-card">
              <div className="project-image-container">
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
              </div>

              <div className="project-info">
                <span className="project-category">{project.category}</span>
                <h1 className="project-title">{project.title}</h1>
                <p className="project-description">{project.description}</p>

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

                <div className="project-creator-info">
                  <div className="creator-avatar-large">
                    {project.creator?.name?.charAt(0) || "?"}
                  </div>
                  <div className="project-creator-details">
                    <h4>{project.creator?.name}</h4>
                    <p>{project.creator?.role || "Verified Startup"}</p>
                  </div>
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
                </div>
              </div>
            </Card>

            {/* ── Campaign Gallery ── */}
            {images.length > 0 && (
              <div className="gallery-section">
                <h3 className="section-heading-sm">Campaign Gallery</h3>
                <div className="gallery-grid">
                  {images.map((img, i) => (
                    <div
                      className="project-gallery-tile"
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                    >
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
                    </div>
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
            <Card className="project-sidebar-card">
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
              <div className="project-progress-track">
                <div
                  className="project-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

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
            </Card>
          </div>
        </Grid>
      </Container>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="project-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="project-lightbox-close" onClick={closeLightbox}>
              <X size={22} />
            </button>

            {images.length > 1 && (
              <button
                className="project-lightbox-nav left"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <motion.img
              className="project-lightbox-img"
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
              <button
                className="project-lightbox-nav right"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Counter */}
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Report Modal ── */}
      <AnimatePresence>
        {reportOpen && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReportOpen(false)}
          >
            <motion.div
              className="project-modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="project-modal-close"
                onClick={() => setReportOpen(false)}
              >
                <X size={20} />
              </button>

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
                <label className="project-label">Issue Type</label>
                <select
                  className="project-select"
                  value={reportData.type}
                  onChange={(e) =>
                    setReportData({ ...reportData, type: e.target.value })
                  }
                >
                  <option value="fraud">Fraud / Scam</option>
                  <option value="unpaid">Unpaid / Financial Dispute</option>
                  <option value="bug">Bug / Technical Issue</option>
                  <option value="other">Other</option>
                </select>

                <label className="project-label">Subject</label>
                <input
                  className="project-input-field"
                  placeholder="Brief summary of the issue..."
                  value={reportData.subject}
                  onChange={(e) =>
                    setReportData({ ...reportData, subject: e.target.value })
                  }
                  required
                />

                <label className="project-label">Description</label>
                <textarea
                  className="project-textarea-field"
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
            </motion.div>
          </motion.div>
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
    </div>
  );
};

export default ProjectDetails;
