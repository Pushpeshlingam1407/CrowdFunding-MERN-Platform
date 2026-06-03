import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings, 
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Edit,
  Building2,
  Users,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button, Flex } from '../components/ui';
import DocumentUpload from '../components/ui/DocumentUpload';
import useAuthStore from '../store/authStore';
import { projectAPI, investmentAPI } from '../services/api';

const DashboardWrapper = styled.div`
  padding: 3rem 0;
  background: #F4F7FE; /* V2 Premium Background */
  min-height: calc(100vh - 80px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const DashboardLayout = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  border: none;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
  position: sticky;
  top: 100px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  color: ${p => p.$active ? '#4318FF' : '#A3AED0'};
  background: ${p => p.$active ? 'rgba(67, 24, 255, 0.05)' : 'transparent'};
  font-weight: ${p => p.$active ? '700' : '600'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;

  &:hover {
    background: rgba(67, 24, 255, 0.03);
    color: #4318FF;
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
  border: none;
  
  .icon-box {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${p => p.$bg || 'rgba(67, 24, 255, 0.1)'};
    color: ${p => p.$color || '#4318FF'};
    box-shadow: 0 4px 12px ${p => p.$bg || 'rgba(67, 24, 255, 0.1)'};
  }

  .stat-info {
    h3 { font-size: 1.75rem; font-weight: 800; color: #2B3674; margin-bottom: 0.25rem; }
    p { color: #A3AED0; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  }
`;

const ContentCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
  border: none;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th {
    text-align: left;
    padding: 1.25rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #A3AED0;
    border-bottom: 1px solid #f1f5f9;
  }

  td {
    padding: 1.25rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.95rem;
    color: #475569;
    vertical-align: middle;
  }
  
  tbody tr { transition: all 0.2s; background: #ffffff; }
  tbody tr:hover { background: #F4F7FE; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(112, 144, 176, 0.08); }
  tbody tr:last-child td { border-bottom: none; }
`;

const StatusBadge = styled.span`
  padding: 0.35rem 0.8rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch(props.status) {
      case 'active': case 'approved': return 'rgba(5, 205, 153, 0.1)';
      case 'pending': return 'rgba(255, 181, 71, 0.1)';
      case 'rejected': return 'rgba(227, 26, 26, 0.1)';
      default: return 'rgba(163, 174, 208, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'active': case 'approved': return '#05CD99';
      case 'pending': return '#FFB547';
      case 'rejected': return '#E31A1A';
      default: return '#A3AED0';
    }
  }};
`;

const PremiumBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$primary ? 'linear-gradient(135deg, #4318FF 0%, #868CFF 100%)' : '#ffffff'};
  color: ${p => p.$primary ? '#ffffff' : '#4318FF'};
  border: ${p => p.$primary ? 'none' : '1px solid rgba(67, 24, 255, 0.3)'};
  box-shadow: ${p => p.$primary ? '0 4px 12px rgba(67, 24, 255, 0.3)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${p => p.$primary ? '0 8px 24px rgba(67, 24, 255, 0.4)' : '0 4px 12px rgba(67, 24, 255, 0.1)'};
    background: ${p => p.$primary ? '' : 'rgba(67, 24, 255, 0.05)'};
  }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
  background: #ffffff;

  ${(props) =>
    props.$variant === "danger"
      ? `color: #E31A1A; border-color: rgba(227,26,26,0.3); &:hover { background: rgba(227,26,26,0.1); }`
      : `color: #4318FF; border-color: rgba(67,24,255,0.3); &:hover { background: rgba(67,24,255,0.1); }`}
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });

  useEffect(() => {
    // Determine what to fetch based on role
    if (user?.role === 'startup') {
      fetchProjects();
    } else {
      // For investor, mnc, and employee, we fetch investments
      fetchInvestments();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getUserProjects();
      setProjects(response.data);
      const total = response.data.length;
      const active = response.data.filter(p => p.status === 'approved' || p.status === 'active').length;
      const pending = response.data.filter(p => p.status === 'pending').length;
      setStats({ total, active, pending });
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await investmentAPI.getUserInvestments();
      const invs = Array.isArray(response.data.investments) ? response.data.investments : [];
      setInvestments(invs);
      
      const total = invs.length;
      const totalAmt = invs.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      setStats({ total, active: totalAmt, pending: 0 });
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectAPI.deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  // --- RENDERING CONFIGURATIONS BY ROLE ---
  
  const renderSidebarNav = () => {
    const common = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ];
    const ending = [
      { id: 'messages', label: 'Private Space', icon: MessageSquare },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];

    if (user?.role === 'startup') {
      return [...common, { id: 'campaigns', label: 'My Campaigns', icon: Briefcase }, ...ending];
    } else if (user?.role === 'investor') {
      return [...common, { id: 'investments', label: 'My Portfolio', icon: TrendingUp }, ...ending];
    } else if (user?.role === 'mnc') {
      return [...common, { id: 'partnerships', label: 'Strategic Backing', icon: Building2 }, ...ending];
    } else if (user?.role === 'employee') {
      return [...common, { id: 'fractional', label: 'Internal Matchings', icon: Users }, ...ending];
    }
    return [...common, ...ending];
  };

  const renderStats = () => {
    if (user?.role === 'startup') {
      return (
        <StatsGrid>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="icon-box" $bg="rgba(67, 24, 255, 0.1)" $color="#4318FF"><TrendingUp size={24} /></div>
            <div className="stat-info"><h3>{stats.total}</h3><p>Total Campaigns</p></div>
          </StatCard>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="icon-box" $bg="rgba(5, 205, 153, 0.1)" $color="#05CD99"><CheckCircle2 size={24} /></div>
            <div className="stat-info"><h3>{stats.active}</h3><p>Active Campaigns</p></div>
          </StatCard>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="icon-box" $bg="rgba(255, 181, 71, 0.1)" $color="#FFB547"><Clock size={24} /></div>
            <div className="stat-info"><h3>{stats.pending}</h3><p>Pending Moderation</p></div>
          </StatCard>
        </StatsGrid>
      );
    } else if (user?.role === 'mnc') {
      return (
        <StatsGrid>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="icon-box" $bg="rgba(168, 85, 247, 0.1)" $color="#A855F7"><Building2 size={24} /></div>
            <div className="stat-info"><h3>{stats.total}</h3><p>Enterprise Partnerships</p></div>
          </StatCard>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="icon-box" $bg="rgba(5, 205, 153, 0.1)" $color="#05CD99"><CheckCircle2 size={24} /></div>
            <div className="stat-info"><h3>₹{stats.active.toLocaleString()}</h3><p>Strategic Capital Deployed</p></div>
          </StatCard>
        </StatsGrid>
      );
    } else if (user?.role === 'employee') {
      return (
        <StatsGrid>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="icon-box" $bg="rgba(67, 24, 255, 0.1)" $color="#4318FF"><Users size={24} /></div>
            <div className="stat-info"><h3>{stats.total}</h3><p>Co-Investments Joined</p></div>
          </StatCard>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="icon-box" $bg="rgba(5, 205, 153, 0.1)" $color="#05CD99"><Target size={24} /></div>
            <div className="stat-info"><h3>₹{stats.active.toLocaleString()}</h3><p>Fractional Capital Deployed</p></div>
          </StatCard>
        </StatsGrid>
      );
    } else {
      // Default / Investor
      return (
        <StatsGrid>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="icon-box" $bg="rgba(67, 24, 255, 0.1)" $color="#4318FF"><TrendingUp size={24} /></div>
            <div className="stat-info"><h3>{stats.total}</h3><p>Campaigns Backed</p></div>
          </StatCard>
          <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="icon-box" $bg="rgba(5, 205, 153, 0.1)" $color="#05CD99"><CheckCircle2 size={24} /></div>
            <div className="stat-info"><h3>₹{stats.active.toLocaleString()}</h3><p>Total Capital Invested</p></div>
          </StatCard>
        </StatsGrid>
      );
    }
  };

  const renderTableData = () => {
    if (user?.role === 'startup') {
      return (
        <ContentCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Flex justify="space-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B3674' }}>Recent Campaigns</h2>
            <PremiumBtn onClick={() => setActiveTab('campaigns')}>View All</PremiumBtn>
          </Flex>
          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>CAMPAIGN NAME</th>
                  <th>CATEGORY</th>
                  <th>TARGET</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map(project => (
                  <tr key={project._id}>
                    <td style={{ fontWeight: 800, color: '#2B3674' }}>{project.title}</td>
                    <td style={{ fontWeight: 600 }}>{project.category}</td>
                    <td style={{ fontWeight: 800, color: '#4318FF' }}>₹{project.targetAmount?.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={project.status}>{project.status}</StatusBadge>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <ActionBtn onClick={() => navigate(`/projects/${project._id}`)}><ExternalLink size={14} /></ActionBtn>
                        <ActionBtn onClick={() => navigate(`/projects/${project._id}/edit`)}><Edit size={14} /></ActionBtn>
                        <ActionBtn $variant="danger" onClick={() => handleDelete(project._id)}><Trash2 size={14} /></ActionBtn>
                      </Flex>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#A3AED0', fontWeight: 600 }}>
                      No campaigns found. Start by creating one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </ContentCard>
      );
    } else {
      // Investor, MNC, Employee tables
      let title = "Recent Backings";
      let emptyMsg = "You have not backed any campaigns yet. Explore the marketplace!";
      if (user?.role === 'mnc') {
        title = "Strategic Partnerships";
        emptyMsg = "No strategic partnerships yet. Discover enterprise opportunities!";
      } else if (user?.role === 'employee') {
        title = "Internal Co-Investments";
        emptyMsg = "You haven't participated in any internal rounds yet.";
      }

      const activeTabTarget = user?.role === 'mnc' ? 'partnerships' : user?.role === 'employee' ? 'fractional' : 'investments';

      return (
        <ContentCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Flex justify="space-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B3674' }}>{title}</h2>
            <PremiumBtn onClick={() => setActiveTab(activeTabTarget)}>View All</PremiumBtn>
          </Flex>
          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>CAMPAIGN NAME</th>
                  <th>AMOUNT DEPLOYED</th>
                  <th>DATE BACKED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 5).map(inv => (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: 800, color: '#2B3674' }}>{inv.project?.title || '—'}</td>
                    <td style={{ color: '#05CD99', fontWeight: 800 }}>₹{inv.amount?.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{new Date(inv.completedAt || inv.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <StatusBadge status={inv.status}>{inv.status}</StatusBadge>
                    </td>
                    <td>
                      <ActionBtn onClick={() => navigate(`/projects/${inv.project?.id || inv.project?._id}`)}>
                        <ExternalLink size={14} />
                      </ActionBtn>
                    </td>
                  </tr>
                ))}
                {investments.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#A3AED0', fontWeight: 600 }}>
                      {emptyMsg}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </ContentCard>
      );
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'campaigns':
      case 'investments':
      case 'partnerships':
      case 'fractional':
        return renderTableData(); // Re-use the table rendering logic for full view since it's the same structure
      case 'documents':
        return (
          <ContentCard style={{ padding: '2.5rem' }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2B3674', marginBottom: '2rem' }}>Professional Records</h2>
             <DocumentUpload />
          </ContentCard>
        );
      case 'messages':
        return (
          <ContentCard style={{ padding: '4rem', textAlign: 'center' }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
             <MessageSquare size={64} style={{ color: '#4318FF', marginBottom: '1.5rem', opacity: 0.2 }} />
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2B3674', marginBottom: '1rem' }}>Secure Messaging Space</h3>
             <p style={{ color: '#A3AED0', fontWeight: 500, marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
               Connect directly with startups, professional investors, and enterprises in a fully isolated ecosystem.
             </p>
             <PremiumBtn $primary onClick={() => navigate('/messages')}>Enter Private Space</PremiumBtn>
          </ContentCard>
        );
      case 'settings':
        return (
          <ContentCard style={{ padding: '4rem', textAlign: 'center' }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
             <Settings size={64} style={{ color: '#A3AED0', marginBottom: '1.5rem', opacity: 0.2 }} />
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2B3674', marginBottom: '1rem' }}>Account Configuration</h3>
             <p style={{ color: '#A3AED0', fontWeight: 500 }}>Settings module configuration is managed in the Profile area.</p>
          </ContentCard>
        );
      default:
        return (
          <>
            {renderStats()}
            {renderTableData()}
          </>
        );
    }
  };


  return (
    <DashboardWrapper>
      <DashboardLayout>
        <Sidebar>
          <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B3674', letterSpacing: '-0.5px' }}>
              Portal
            </h2>
          </div>
          {renderSidebarNav().map(nav => (
            <NavItem key={nav.id} $active={activeTab === nav.id} onClick={() => setActiveTab(nav.id)}>
              <nav.icon size={20} strokeWidth={activeTab === nav.id ? 2.5 : 2} /> {nav.label}
            </NavItem>
          ))}
        </Sidebar>

        <MainContent>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#2B3674', letterSpacing: '-1px', marginBottom: '0.25rem' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p style={{ color: '#A3AED0', fontWeight: 600, fontSize: '0.95rem' }}>
                {user?.role === 'startup' ? "Here's an overview of your active campaigns." :
                 user?.role === 'mnc' ? "Here's an overview of your corporate partnerships." :
                 user?.role === 'employee' ? "Here's an overview of your fractional investments." :
                 "Here's an overview of your venture portfolio."}
              </p>
            </div>
            {user?.role === 'startup' ? (
              <PremiumBtn $primary onClick={() => navigate('/projects/new')}>
                <Plus size={18} style={{ marginRight: 6 }} /> Create Campaign
              </PremiumBtn>
            ) : (
              <PremiumBtn $primary onClick={() => navigate('/marketplace')}>
                Explore Marketplace
              </PremiumBtn>
            )}
          </header>

          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </MainContent>
      </DashboardLayout>
    </DashboardWrapper>
  );
};

export default Dashboard;