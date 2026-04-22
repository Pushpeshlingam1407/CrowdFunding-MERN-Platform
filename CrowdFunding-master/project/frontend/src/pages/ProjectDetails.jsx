import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid } from '../components/ui';
import InvestmentModal from '../components/InvestmentModal';
import PaymentModal from '../components/PaymentModal';
import useAuthStore from '../store/authStore';
import { projectAPI } from '../services/api';

/* ─── Styled Components ─────────────────────────────────────── */

const ProjectWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const HeroCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: 24px;
`;

const ImageContainer = styled.div`
  height: 400px;
  width: 100%;
  position: relative;
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
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.locked ? '#e53e3e' : props.theme.colors.primary};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const ProjectInfo = styled.div`padding: 3rem;`;

const Category = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: block;
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 2.5rem;
`;

const SidebarCard = styled(Card)`
  position: sticky;
  top: 100px;
  padding: 2rem;
`;

const ProgressTrack = styled.div`
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.6s ease;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 2rem;
`;

const CreatorDetails = styled.div`
  h4 { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
  p  { font-size: 0.85rem; color: #888; }
`;

/* ── Gallery image tile ── */
const GalleryTile = styled.div`
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover img { transform: scale(1.05); }

  .zoom-hint {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    opacity: 0;
  }
  &:hover .zoom-hint {
    background: rgba(0,0,0,0.35);
    opacity: 1;
  }
`;

/* ── Lightbox ── */
const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxImg = styled(motion.img)`
  max-width: 90vw;
  max-height: 88vh;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 8px 60px rgba(0,0,0,0.6);
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.15);
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
  &:hover { background: rgba(255,255,255,0.3); }
`;

const LightboxNav = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.side === 'left' ? 'left: 1.5rem;' : 'right: 1.5rem;'}
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
  &:hover { background: rgba(255,255,255,0.3); }
`;

/* ── Report Modal ── */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  &:hover { color: #333; }
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background: white;
  margin-bottom: 1.25rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  box-sizing: border-box;
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 1.25rem;
  box-sizing: border-box;
`;

/* ─── Component ─────────────────────────────────────────────── */

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [project, setProject] = useState(null);
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
  const [reportData, setReportData] = useState({ type: 'fraud', subject: '', description: '' });

  /* ── Fetch ── */
  const fetchProjectDetails = async () => {
    try {
      const response = await projectAPI.getProject(id);
      setProject(response.data);
    } catch (error) {
      toast.error('Error loading project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjectDetails(); }, [id]);

  /* ── Lightbox keyboard nav ── */
  const images = project?.campaignImages || [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex(i => (i - 1 + images.length) % images.length), [images.length]);
  const nextImage = useCallback(() =>
    setLightboxIndex(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handle = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  /* ── Invest ── */
  const handleInvestClick = () => {
    if (!isAuthenticated) { toast.error('Please login to invest'); navigate('/login'); return; }
    setInvestmentModalOpen(true);
  };

  const handleInvestmentSubmit = (amount) => {
    setInvestmentAmount(amount);
    setInvestmentModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    await fetchProjectDetails();
    toast.success('Investment successful! Check your portfolio for details.');
    navigate('/dashboard');
  };

  /* ── Report submit ── */
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to report'); return; }
    if (!reportData.subject.trim() || !reportData.description.trim()) {
      toast.error('Please fill in subject and description'); return;
    }
    setReportSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/complaints`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            type: reportData.type,
            subject: reportData.subject,
            description: reportData.description,
            targetCompanyId: project.creator?._id,
          })
        }
      );
      if (!res.ok) throw new Error('Failed to submit report');
      toast.success('Report submitted. Our compliance team will review it.');
      setReportOpen(false);
      setReportData({ type: 'fraud', subject: '', description: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setReportSubmitting(false);
    }
  };

  /* ── Render ── */
  if (loading) return <div style={{ padding: '8rem', textAlign: 'center' }}>Loading Project...</div>;
  if (!project) return <div style={{ padding: '8rem', textAlign: 'center' }}>Project Not Found</div>;

  const progress = Math.min(100, (project.currentAmount / project.targetAmount) * 100);
  const isCreator = user?.id === project.creator?._id;

  const getImgSrc = (img) => img?.startsWith('http') ? img : `http://localhost:5000${img}`;
  const fallbackSrc = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2070';

  return (
    <ProjectWrapper>
      <Container>
        <Button
          variant="outline"
          onClick={() => navigate('/campaigns')}
          style={{ marginBottom: '2rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Marketplace
        </Button>

        <Grid cols="2fr 1fr" gap="2rem">
          {/* ── Left column ── */}
          <div>
            <HeroCard>
              <ImageContainer>
                <img
                  src={getImgSrc(project.image)}
                  alt={project.title}
                  onError={(e) => { e.target.src = fallbackSrc; }}
                />
                <StatusOverlay locked={project.isLocked}>
                  {project.isLocked ? <Lock size={16} /> : <ShieldCheck size={16} />}
                  {project.isLocked ? 'EXPIRED' : 'ACTIVE'}
                </StatusOverlay>
              </ImageContainer>

              <ProjectInfo>
                <Category>{project.category}</Category>
                <ProjectTitle>{project.title}</ProjectTitle>
                <Description>{project.description}</Description>

                <Grid cols={3} gap="2rem">
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Equity Offered</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{project.equity}%</span>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Target Goal</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{project.targetAmount.toLocaleString()}</span>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>B2B Tier</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enterprise</span>
                  </Flex>
                </Grid>

                <CreatorInfo>
                  {/* Avatar with initials */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#0077b615', color: '#0077b6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {project.creator?.name?.charAt(0) || '?'}
                  </div>
                  <CreatorDetails>
                    <h4>{project.creator?.name}</h4>
                    <p>{project.creator?.role || 'Verified Startup'}</p>
                  </CreatorDetails>
                  <Flex gap="1rem" style={{ marginLeft: 'auto' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/company/${project.creator?._id}`)}
                    >
                      Visit Profile
                    </Button>
                    {!isCreator && (
                      <Button size="sm">
                        <MessageSquare size={16} style={{ marginRight: 8 }} /> Connect
                      </Button>
                    )}
                  </Flex>
                </CreatorInfo>
              </ProjectInfo>
            </HeroCard>

            {/* ── Campaign Gallery ── */}
            {images.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
                  Campaign Gallery
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '1rem'
                }}>
                  {images.map((img, i) => (
                    <GalleryTile key={i} onClick={() => setLightboxIndex(i)}>
                      <img
                        src={getImgSrc(img)}
                        alt={`Gallery ${i + 1}`}
                        onError={(e) => { e.target.src = fallbackSrc; }}
                      />
                      <div className="zoom-hint">
                        <ZoomIn size={28} color="white" />
                      </div>
                    </GalleryTile>
                  ))}
                </div>
              </div>
            )}

            {/* ── Action bar ── */}
            <Flex gap="1rem" style={{ marginTop: '1.5rem' }}>
              <Button variant="outline">
                <Share2 size={18} style={{ marginRight: 8 }} /> Share
              </Button>
              <Button
                variant="outline"
                style={{ color: '#e53e3e', borderColor: '#fed7d7' }}
                onClick={() => {
                  if (!isAuthenticated) { toast.error('Please login to report'); return; }
                  setReportOpen(true);
                }}
              >
                <Flag size={18} style={{ marginRight: 8 }} /> Report / Flag
              </Button>
            </Flex>
          </div>

          {/* ── Sidebar ── */}
          <div>
            <SidebarCard>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Funding Status</h2>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Join the pool of professional investors.</p>

              <Flex justify="space-between">
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹{project.currentAmount.toLocaleString()}</span>
                <span style={{ color: '#0077b6', fontWeight: 700 }}>{progress.toFixed(1)}%</span>
              </Flex>
              <ProgressTrack><ProgressFill progress={progress} /></ProgressTrack>

              <Grid cols={2} gap="1rem" style={{ marginBottom: '2.5rem' }}>
                <Flex direction="column" align="flex-start">
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                    ₹{(project.targetAmount - project.currentAmount).toLocaleString()}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>Still Needed</span>
                </Flex>
                <Flex direction="column" align="flex-start">
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {new Date(project.endDate) > new Date()
                      ? Math.ceil((new Date(project.endDate) - new Date()) / (1000*60*60*24))
                      : 0}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>Days Left</span>
                </Flex>
              </Grid>

              <Button
                size="lg"
                style={{ width: '100%', padding: '1.25rem' }}
                disabled={project.isLocked || isCreator}
                onClick={handleInvestClick}
              >
                {project.isLocked ? 'Campaign Locked' : 'Invest in Startup'}
              </Button>

              {isCreator && (
                <Button
                  variant="outline"
                  size="lg"
                  style={{ width: '100%', marginTop: '1rem' }}
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
            <LightboxClose onClick={closeLightbox}><X size={22} /></LightboxClose>

            {images.length > 1 && (
              <LightboxNav side="left" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
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
              onError={(e) => { e.target.src = fallbackSrc; }}
            />

            {images.length > 1 && (
              <LightboxNav side="right" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                <ChevronRight size={24} />
              </LightboxNav>
            )}

            {/* Counter */}
            <div style={{
              position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600
            }}>
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
              <ModalClose onClick={() => setReportOpen(false)}><X size={20} /></ModalClose>

              <Flex gap="0.75rem" style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AlertCircle size={20} color="#e53e3e" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>Report Campaign</h2>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Your report goes directly to the compliance team.</p>
                </div>
              </Flex>

              <form onSubmit={handleReportSubmit}>
                <Label>Issue Type</Label>
                <Select
                  value={reportData.type}
                  onChange={(e) => setReportData({ ...reportData, type: e.target.value })}
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
                  onChange={(e) => setReportData({ ...reportData, subject: e.target.value })}
                  required
                />

                <Label>Description</Label>
                <TextAreaField
                  placeholder="Describe the issue in detail. Include dates, amounts, or any evidence..."
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  required
                />

                <Flex gap="1rem">
                  <Button
                    type="button"
                    variant="outline"
                    style={{ flex: 1 }}
                    onClick={() => setReportOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ flex: 2, background: '#e53e3e', borderColor: '#e53e3e' }}
                    disabled={reportSubmitting}
                  >
                    <Send size={16} style={{ marginRight: 8 }} />
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
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