import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid, Input } from '../components/ui';
import StarRating from '../components/ui/StarRating';
import ComplaintBox from '../components/ui/ComplaintBox';
import useAuthStore from '../store/authStore';
import { b2bAPI, userAPI, projectAPI } from '../services/api';

const ProfileWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const ProfileHeader = styled(Card)`
  padding: 3rem;
  border-radius: 24px;
  background: white;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  margin-right: 2rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Badge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.theme.colors.primary}10;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const ReviewCard = styled(Card)`
  margin-bottom: 1.5rem;
  padding: 2rem;
`;

const ServiceTag = styled.span`
  padding: 0.5rem 1rem;
  background: #f0f4f8;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
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
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', appreciation: '', feedback: '' });

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
          ? allData.filter(p => p.creator?._id === userId || p.creator === userId)
          : [];
        setProjects(userProjects);
      } catch (e) {
        console.warn('Could not load projects:', e);
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
      toast.success('Review posted successfully!');
      setShowReviewModal(false);
      fetchProfileData(); // Refresh reviews
    } catch (error) {
      toast.error('Failed to post review');
    }
  };

  if (loading) return <div style={{ padding: '8rem', textAlign: 'center' }}>Loading Profile...</div>;
  if (!profile) return <div style={{ padding: '8rem', textAlign: 'center' }}>Profile Not Found</div>;

  return (
    <ProfileWrapper>
      <Container>
        <ProfileHeader>
          <Flex align="flex-start">
            <Avatar>{profile.name.charAt(0)}</Avatar>
            <div style={{ flexGrow: 1 }}>
              <Badge>{profile.role}</Badge>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
                {profile.companyName || profile.name}
              </h1>
              {profile.branding?.slogan && (
                 <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem', fontWeight: 500 }}>
                    "{profile.branding.slogan}"
                 </p>
              )}
              <Flex gap="1.5rem" style={{ color: '#666', marginBottom: '1.5rem' }}>
                <Flex gap="0.5rem"><Globe size={18} /> {profile.companyWebsite || 'N/A'}</Flex>
                <Flex gap="0.5rem"><Mail size={18} /> {profile.email}</Flex>
                <Flex gap="0.5rem"><ShieldCheck size={18} style={{ color: '#2f855a' }} /> Verified Member</Flex>
              </Flex>
              <Flex gap="1rem">
                <Button onClick={() => navigate(`/messages/${id}`)}>
                  <MessageSquare size={18} style={{ marginRight: 8 }} /> Message / Connect
                </Button>
                <Button variant="outline" onClick={() => setShowReviewModal(true)}>
                  <Star size={18} style={{ marginRight: 8 }} /> Leave a Review
                </Button>
                <Button 
                  variant="outline" 
                  style={{ color: '#e53e3e', borderColor: '#fed7d7' }}
                  onClick={() => setShowComplaintBox(true)}
                >
                   <Flag size={18} />
                </Button>
              </Flex>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{profile.stars?.toFixed(1) || '0.0'}</h2>
              <StarRating rating={Math.round(profile.stars || 0)} readonly />
              <p style={{ color: '#888', marginTop: '0.5rem' }}>{profile.reviewsCount || 0} Collaborative Reviews</p>
            </div>
          </Flex>

          {/* Dynamic Trust Bar */}
          <Grid cols={4} gap="1rem" style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid #f0f0f0' }}>
             <Flex gap="1rem" direction="column" align="center" style={{ textAlign: 'center' }}>
                <Users size={24} style={{ color: '#0077b6' }} />
                <div>
                   <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile.dynamicMetrics?.trustedByCount || 0}+</h4>
                   <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Trusted by Entities</p>
                </div>
             </Flex>
             <Flex gap="1rem" direction="column" align="center" style={{ textAlign: 'center' }}>
                <TrendingUp size={24} style={{ color: '#2f855a' }} />
                <div>
                   <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile.dynamicMetrics?.collaborationsCount || 0}</h4>
                   <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Active Collaborations</p>
                </div>
             </Flex>
             <Flex gap="1rem" direction="column" align="center" style={{ textAlign: 'center' }}>
                <Briefcase size={24} style={{ color: '#0077b6' }} />
                <div>
                   <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile.dynamicMetrics?.projectsCount || 0}</h4>
                   <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Platform Ventures</p>
                </div>
             </Flex>
             <Flex gap="1rem" direction="column" align="center" style={{ textAlign: 'center' }}>
                <ShieldCheck size={24} style={{ color: '#2f855a' }} />
                <div>
                   <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>100%</h4>
                   <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>B2B Security Score</p>
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
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}
              >
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Professional Review</h2>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>Your feedback helps maintain high standards in our B2B ecosystem.</p>
                
                <form onSubmit={handlePostReview}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Rating</label>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <StarRating rating={newReview.rating} onChange={(r) => setNewReview({...newReview, rating: r})} />
                  </div>

                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Comment</label>
                  <TextArea 
                    placeholder="General experience working with this company..."
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                  />

                  <Grid cols={2} gap="1rem">
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Appreciation</label>
                      <Input 
                        placeholder="What did they do well?"
                        value={newReview.appreciation}
                        onChange={e => setNewReview({ ...newReview, appreciation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Feedback</label>
                      <Input 
                        placeholder="Room for improvement?"
                        value={newReview.feedback}
                        onChange={e => setNewReview({ ...newReview, feedback: e.target.value })}
                      />
                    </div>
                  </Grid>

                  <Flex gap="1rem" style={{ marginTop: '2rem' }}>
                    <Button variant="outline" type="button" style={{ flexGrow: 1 }} onClick={() => setShowReviewModal(false)}>Cancel</Button>
                    <Button type="submit" style={{ flexGrow: 2 }}>Submit Review</Button>
                  </Flex>
                </form>
              </Card>
            </ModalOverlay>
          )}
        </AnimatePresence>



        <Grid cols="2fr 1fr" gap="2rem">
          <div>
            <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>About the Company</h3>
              <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '2rem' }}>{profile.bio || 'This company has not provided a detailed description yet.'}</p>
              
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Services Offered</h4>
              <Flex gap="0.75rem" wrap="wrap">
                {(profile.services && profile.services.length > 0) ? profile.services.map((service, i) => (
                  <ServiceTag key={i}>{service}</ServiceTag>
                )) : <p style={{ color: '#888' }}>No services specified.</p>}
              </Flex>
            </Card>

            {/* Active Campaigns */}
            {projects.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Active Campaigns</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                  {projects.map(proj => {
                    const progress = Math.min(100, ((proj.currentAmount || 0) / proj.targetAmount) * 100);
                    return (
                      <Card key={proj._id} style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => navigate(`/projects/${proj._id}`)}
                      >
                        <img
                          src={proj.image?.startsWith('http') ? proj.image : `http://localhost:5000${proj.image}`}
                          alt={proj.title}
                          style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <Flex justify="space-between" style={{ marginBottom: '0.4rem' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{proj.title}</h4>
                            <span style={{
                              padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
                              background: proj.status === 'approved' ? '#e6fffa' : '#fffaf0',
                              color: proj.status === 'approved' ? '#047481' : '#b7791f'
                            }}>{proj.status}</span>
                          </Flex>
                          <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.6rem' }}>{proj.category} · ₹{proj.targetAmount?.toLocaleString()} goal</p>
                          <div style={{ height: 6, background: '#eee', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: '#0077b6', borderRadius: 3 }} />
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.4rem' }}>
                            ₹{(proj.currentAmount || 0).toLocaleString()} raised · {progress.toFixed(0)}%
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Legit Works & Portfolio</h3>
            <Grid cols={2} gap="1.5rem" style={{ marginBottom: '3rem' }}>
               {profile.portfolio?.map((work, i) => (
                 <Card key={i} style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ height: '160px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd' }}>
                       {work.image ? <img src={work.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Briefcase size={48} />}
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                       <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{work.title}</h4>
                       <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', lineHeight: '1.5' }}>{work.description}</p>
                       {work.link && (
                          <Button variant="outline" size="sm" onClick={() => window.open(work.link, '_blank')}>
                             View Project <ExternalLink size={14} style={{ marginLeft: 8 }} />
                          </Button>
                       )}
                    </div>
                 </Card>
               ))}
               {(!profile.portfolio || profile.portfolio.length === 0) && (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>No portfolio items uploaded yet.</p>
               )}
            </Grid>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Collaborator Feedbacks</h3>
            {reviews.map(review => (
              <ReviewCard key={review._id}>
                <Flex justify="space-between" style={{ marginBottom: '1rem' }}>
                  <Flex gap="1rem">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee' }} />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{review.author?.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Flex>
                  <StarRating rating={review.rating} readonly />
                </Flex>
                <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '1.5rem' }}>{review.comment}</p>
                <Grid cols={2} gap="1rem">
                  <div style={{ background: '#f6fff6', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #2f855a' }}>
                    <Flex gap="0.5rem" style={{ marginBottom: '0.5rem', color: '#2f855a', fontWeight: 700, fontSize: '0.8rem' }}><ThumbsUp size={14} /> APPRECIATION</Flex>
                    <p style={{ fontSize: '0.9rem', color: '#2f855a' }}>{review.appreciation || 'N/A'}</p>
                  </div>
                  <div style={{ background: '#fdf2f2', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #c53030' }}>
                    <Flex gap="0.5rem" style={{ marginBottom: '0.5rem', color: '#c53030', fontWeight: 700, fontSize: '0.8rem' }}><Heart size={14} /> FEEDBACK</Flex>
                    <p style={{ fontSize: '0.9rem', color: '#c53030' }}>{review.feedback || 'N/A'}</p>
                  </div>
                </Grid>
              </ReviewCard>
            ))}
            {reviews.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>No reviews yet. Be the first to leave one!</p>}
          </div>

          <div>
             <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Review Summary</h3>
               <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
                 {[5,4,3,2,1].map(star => (
                   <Flex key={star} gap="1rem" style={{ marginBottom: '0.5rem' }}>
                     <span style={{ fontSize: '0.85rem', width: '40px' }}>{star} star</span>
                     <div style={{ flexGrow: 1, height: '8px', background: '#eee', borderRadius: '4px' }}>
                       <div style={{ height: '100%', width: star === 5 ? '80%' : '5%', background: '#ffc107', borderRadius: '4px' }} />
                     </div>
                   </Flex>
                 ))}
               </div>
               <div style={{ marginTop: '1.5rem' }}>
                 <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>Our operations are governed by verified B2B protocols.</p>
                 <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate('/terms')}>View Policies</Button>
               </div>
             </Card>

             <Card style={{ padding: '1.5rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Professional Journey</h3>
               <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #0077b615' }}>
                  {profile.activityLog?.slice().reverse().map((log, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                       <div style={{ position: 'absolute', left: '-1.9rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', background: log.type === 'automatic' ? '#0077b6' : '#999' }} />
                       <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{log.milestone}</h5>
                       <p style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(log.date).toLocaleDateString()}</p>
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
