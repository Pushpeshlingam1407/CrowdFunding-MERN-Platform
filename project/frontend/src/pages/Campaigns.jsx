import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Filter, Search, ArrowRight, Users, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Flex, Grid, Input } from '../components/ui';
import { projectAPI } from '../services/api';

const PageHeader = styled.div`
  padding: 4rem 0;
  text-align: center;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

const FilterSection = styled.div`
  padding: 2rem 0;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  padding: 4rem 0;
`;

const CampaignCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  height: 200px;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #eee;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${CampaignCard}:hover & img {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.35rem 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Content = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Category = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  display: block;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProgressInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressBarBase = styled.div`
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.85rem;
`;

const Campaigns = () => {
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

  const categories = ["All", ...Array.from(new Set(campaigns.map(c => c.category).filter(Boolean)))];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHeader>
        <Container>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
              B2B Marketplace
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Discover promising startups, connect with MNCS, and find the next big success story in the global ecosystem.
            </p>
          </motion.div>
        </Container>
      </PageHeader>

      <FilterSection>
        <Container>
          <Flex justify="space-between" wrap="wrap" gap="1rem">
            <Flex gap="1rem">
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <Input 
                  style={{ paddingLeft: '2.75rem' }} 
                  placeholder="Search campaigns..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Flex gap="0.5rem">
                {categories.map(cat => (
                  <Button 
                    key={cat} 
                    variant={selectedCategory === cat ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </Flex>
            </Flex>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
              Showing {filteredCampaigns.length} campaigns
            </div>
          </Flex>
        </Container>
      </FilterSection>

      <Container>
        <CampaignGrid>
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '4rem' }}>Loading campaigns...</div>
          ) : (
            filteredCampaigns.map(campaign => {
              const progress = Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100);
              const daysLeft = calculateDaysLeft(campaign.endDate);
              const isLocked = daysLeft === 0;

              return (
                <CampaignCard key={campaign._id}>
                  <ImageWrapper>
                    <img 
                      src={campaign.image?.startsWith('http') ? campaign.image : `http://localhost:5000${campaign.image}`} 
                      alt={campaign.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2070'; }}
                    />
                    <Badge>
                      {isLocked ? <CheckCircle2 size={12} style={{ marginRight: 4, display: 'inline' }} /> : <Clock size={12} style={{ marginRight: 4, display: 'inline' }} />}
                      {isLocked ? 'COMPLETED' : `${daysLeft} DAYS LEFT`}
                    </Badge>
                  </ImageWrapper>
                  <Content>
                    <Category>{campaign.category}</Category>
                    <Title>{campaign.title}</Title>
                    <Description>{campaign.description}</Description>
                    
                    <ProgressInfo>
                      <Flex justify="space-between" style={{ marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{progress.toFixed(1)}% funded</span>
                        <span style={{ color: '#666' }}>Target: ₹{campaign.targetAmount.toLocaleString()}</span>
                      </Flex>
                      <ProgressBarBase>
                        <ProgressBarFill progress={progress}/>
                      </ProgressBarBase>
                    </ProgressInfo>

                    <StatsGrid>
                      <StatItem>
                        <Users size={16} />
                        <span>{campaign.creator?.name || 'Vetted Startup'}</span>
                      </StatItem>
                      <StatItem style={{ justifyContent: 'flex-end' }}>
                        <DollarSign size={16} />
                        <span>Equity: {campaign.equity}</span>
                      </StatItem>
                    </StatsGrid>
                    
                    <Link to={`/projects/${campaign._id}`} style={{ textDecoration: 'none', marginTop: '1.5rem' }}>
                      <Button style={{ width: '100%' }}>
                        View Portfolio <ArrowRight size={18} style={{ marginLeft: 8 }} />
                      </Button>
                    </Link>
                  </Content>
                </CampaignCard>
              );
            })
          )}
        </CampaignGrid>
      </Container>
    </>
  );
};

export default Campaigns;
