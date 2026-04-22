import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Briefcase, DollarSign, Target } from 'lucide-react';
import { Button, Card, Container, Flex, Grid } from './ui';
import { toast } from 'react-toastify';

const PortfolioWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const Header = styled.div`
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    font-size: 1rem;
  }
`;

const StatsGrid = styled(Grid)`
  margin-bottom: 3rem;
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  svg {
    width: 40px;
    height: 40px;
    color: #0077b6;
    flex-shrink: 0;
  }
`;

const StatContent = styled.div`
  h3 {
    font-size: 0.85rem;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0077b6;
  }
`;

const InvestmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InvestmentCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr auto;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s;
  border: 1px solid #f0f0f0;

  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    border-color: #e0e0e0;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: #eee;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    height: 200px;
  }
`;

const ProjectInfo = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    font-size: 0.85rem;
    color: #888;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .category {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #f0f7ff;
    color: #0077b6;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const InvestmentAmount = styled.div`
  h4 {
    font-size: 0.85rem;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0077b6;
  }
`;

const InvestmentStatus = styled.div`
  h4 {
    font-size: 0.85rem;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  span {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    background: ${props => props.status === 'completed' ? '#f0fdf4' : '#f0f7ff'};
    color: ${props => props.status === 'completed' ? '#22c55e' : '#3b82f6'};
    border: 1px solid ${props => props.status === 'completed' ? '#dcfce7' : '#dbeafe'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  
  svg {
    width: 64px;
    height: 64px;
    color: #ddd;
    margin: 0 auto 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    color: #888;
    margin-bottom: 2rem;
  }
`;

const Portfolio = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    averageReturn: 0
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/investments/user`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }

      const data = await response.json();
      setInvestments(data.success ? data.investments : []);

      // Calculate stats
      const totalInvested = data.investments.reduce((sum, inv) => {
        return inv.status === 'completed' ? sum + inv.amount : sum;
      }, 0);

      const activeInvestments = data.investments.filter(inv => inv.status === 'completed').length;

      setStats({
        totalInvested,
        activeInvestments,
        averageReturn: activeInvestments > 0 ? Math.round(totalInvested / activeInvestments) : 0
      });
    } catch (error) {
      toast.error('Failed to load your investments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PortfolioWrapper>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Loading your portfolio...</p>
          </div>
        </Container>
      </PortfolioWrapper>
    );
  }

  return (
    <PortfolioWrapper>
      <Container>
        <Header>
          <h1>Investment Portfolio</h1>
          <p>Track your investments across all campaigns</p>
        </Header>

        <StatsGrid cols={3} gap="1.5rem" style={{ marginBottom: '3rem' }}>
          <StatCard>
            <DollarSign />
            <StatContent>
              <h3>Total Invested</h3>
              <p>₹{stats.totalInvested.toLocaleString()}</p>
            </StatContent>
          </StatCard>
          <StatCard>
            <Briefcase />
            <StatContent>
              <h3>Active Investments</h3>
              <p>{stats.activeInvestments}</p>
            </StatContent>
          </StatCard>
          <StatCard>
            <TrendingUp />
            <StatContent>
              <h3>Average Investment</h3>
              <p>₹{stats.averageReturn.toLocaleString()}</p>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {investments.length === 0 ? (
          <EmptyState>
            <Briefcase />
            <h3>No Investments Yet</h3>
            <p>Start building your investment portfolio. Explore our campaigns and invest in startups.</p>
            <Button onClick={() => navigate('/campaigns')}>
              Explore Campaigns
            </Button>
          </EmptyState>
        ) : (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Your Investments</h2>
            <InvestmentList>
              {investments.map((investment, index) => (
                <InvestmentCard
                  key={investment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <ProjectImage>
                    <img
                      src={
                        investment.project?.image?.startsWith('http')
                          ? investment.project.image
                          : `http://localhost:5000${investment.project?.image}`
                      }
                      alt={investment.project?.title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  </ProjectImage>

                  <ProjectInfo>
                    <h3>{investment.project?.title}</h3>
                    <p>{investment.project?.description?.substring(0, 100)}...</p>
                    <span className="category">Technology</span>
                  </ProjectInfo>

                  <InvestmentAmount>
                    <h4>Amount</h4>
                    <p>₹{investment.amount.toLocaleString()}</p>
                  </InvestmentAmount>

                  <InvestmentStatus status={investment.status}>
                    <h4>Status</h4>
                    <span>{investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}</span>
                  </InvestmentStatus>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/projects/${investment.project?._id}`)}
                  >
                    View <ArrowRight size={16} style={{ marginLeft: 8 }} />
                  </Button>
                </InvestmentCard>
              ))}
            </InvestmentList>
          </>
        )}
      </Container>
    </PortfolioWrapper>
  );
};

export default Portfolio;
