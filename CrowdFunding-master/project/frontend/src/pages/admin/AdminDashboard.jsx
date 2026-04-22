import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  BarChart3,
  ShieldCheck,
  LogOut,
  AlertCircle,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';

// ─── Animations ──────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;
// ─────────────────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  min-height: 100vh;
  background: #080e1a;
  padding: 0;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  background: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid #1e293b;
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 9px;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e293b;
    color: #f87171;
    border-color: #f87171;
  }
`;

const PageBody = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -2px;
  color: #f8fafc;
  margin-bottom: 0.5rem;

  span {
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const WelcomeSub = styled.p`
  color: #475569;
  font-size: 1rem;
`;

// Stats Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(135deg, ${p => p.$from} 0%, ${p => p.$to} 100%);
  border-radius: 18px;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -20%;
    width: 120px;
    height: 120px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }
`;

const StatLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255,255,255,0.55);
  margin-bottom: 0.75rem;
`;

const StatValue = styled.h2`
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #fff;
  margin-bottom: 0.25rem;
`;

const StatSub = styled.p`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.45);
`;

// Nav Modules Grid
const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const ModuleCard = styled(motion.div)`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 1.75rem;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: ${p => p.$accent};
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }
`;

const ModuleIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  margin-bottom: 1.25rem;
`;

const ModuleTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 0.4rem;
`;

const ModuleDesc = styled.p`
  font-size: 0.82rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const ModuleLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${p => p.$color};
`;

// Recent Activity Bar
const ActivityBar = styled.div`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 2rem;
`;

const ActivityTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, #1e293b 25%, #263349 50%, #1e293b 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: ${p => p.$h || '1rem'};
  width: ${p => p.$w || '100%'};
`;

const BASE = 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const getToken = () =>
    localStorage.getItem('adminToken') || localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(`${BASE}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
    toast.info('Admin session ended');
  };

  const statCards = stats
    ? [
        {
          label: 'Total Users',
          value: stats.totalUsers.toLocaleString(),
          sub: 'Registered accounts',
          icon: <Users size={20} />,
          from: '#1d4ed8',
          to: '#3b82f6',
        },
        {
          label: 'Total Campaigns',
          value: stats.totalProjects.toLocaleString(),
          sub: `${stats.approvedProjects} approved`,
          icon: <Briefcase size={20} />,
          from: '#065f46',
          to: '#10b981',
        },
        {
          label: 'Pending Review',
          value: stats.pendingProjects.toLocaleString(),
          sub: 'Awaiting moderation',
          icon: <Clock size={20} />,
          from: '#92400e',
          to: '#f59e0b',
        },
        {
          label: 'Total Invested',
          value: `₹${(stats.totalInvestedAmount / 100000).toFixed(1)}L`,
          sub: `${stats.totalInvestments} investments`,
          icon: <DollarSign size={20} />,
          from: '#4c1d95',
          to: '#8b5cf6',
        },
      ]
    : [];

  const modules = [
    {
      title: 'Campaign Moderation',
      desc: 'Approve, reject, and manage all startup campaigns awaiting verification.',
      icon: <Briefcase size={22} />,
      color: '#38bdf8',
      bg: 'rgba(56,189,248,0.1)',
      path: '/admin/projects',
    },
    {
      title: 'User Ecosystem',
      desc: 'Manage startups, investors, MNCs and platform members.',
      icon: <Users size={22} />,
      color: '#4ade80',
      bg: 'rgba(74,222,128,0.1)',
      path: '/admin/users',
    },
    {
      title: 'Platform Analytics',
      desc: 'Deep-dive into investment trends, growth metrics and KPIs.',
      icon: <BarChart3 size={22} />,
      color: '#fb923c',
      bg: 'rgba(251,146,60,0.1)',
      path: '/admin/analytics',
    },
    {
      title: 'Compliance Reports',
      desc: 'Review bug reports, fraud allegations and user complaints.',
      icon: <AlertCircle size={22} />,
      color: '#f87171',
      bg: 'rgba(248,113,113,0.1)',
      path: '/admin/complaints',
    },
    {
      title: 'Admin Settings',
      desc: 'Configure platform-wide policies, security and access.',
      icon: <Settings size={22} />,
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.1)',
      path: '/admin/settings',
    },
  ];

  return (
    <Wrapper>
      {/* Sticky top bar */}
      <TopBar>
        <Brand>
          <ShieldCheck size={24} style={{ color: '#38bdf8' }} />
          Terminal Admin
        </Brand>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#475569' }}>
            Signed in as&nbsp;
            <strong style={{ color: '#94a3b8' }}>{adminUser?.email || 'admin'}</strong>
          </span>
          <LogoutBtn onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </LogoutBtn>
        </div>
      </TopBar>

      <PageBody>
        {/* Welcome */}
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back,&nbsp;<span>{adminUser?.name || 'Admin'}</span>
          </WelcomeTitle>
          <WelcomeSub>
            Here's what's happening on the StartupFund platform right now.
          </WelcomeSub>
        </WelcomeSection>

        {/* Stats */}
        <StatsGrid>
          {loadingStats
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ borderRadius: 18, overflow: 'hidden' }}>
                  <Skeleton $h="128px" />
                </div>
              ))
            : statCards.map((card, i) => (
                <StatCard
                  key={i}
                  $from={card.from}
                  $to={card.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <StatLabel>{card.label}</StatLabel>
                  <StatValue>{card.value}</StatValue>
                  <StatSub>{card.sub}</StatSub>
                </StatCard>
              ))}
        </StatsGrid>

        {/* Module Cards */}
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.25rem' }}>
          Admin Modules
        </h2>
        <ModulesGrid>
          {modules.map((m, i) => (
            <ModuleCard
              key={i}
              $accent={m.color}
              onClick={() => navigate(m.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <ModuleIcon $bg={m.bg} $color={m.color}>
                {m.icon}
              </ModuleIcon>
              <ModuleTitle>{m.title}</ModuleTitle>
              <ModuleDesc>{m.desc}</ModuleDesc>
              <ModuleLink $color={m.color}>
                Manage <ChevronRight size={14} />
              </ModuleLink>
            </ModuleCard>
          ))}
        </ModulesGrid>

        {/* Activity Summary */}
        <ActivityBar>
          <ActivityTitle>
            <TrendingUp size={18} style={{ color: '#38bdf8' }} />
            Platform Summary
          </ActivityTitle>
          {loadingStats ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} $h="70px" />)}
            </div>
          ) : stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
              {[
                { label: 'Approved Ventures', value: stats.approvedProjects, color: '#4ade80' },
                { label: 'Pending KYC Docs', value: stats.pendingDocuments, color: '#fbbf24' },
                { label: 'Total Investments', value: stats.totalInvestments, color: '#38bdf8' },
                { label: 'Total Raised', value: `₹${(stats.totalInvestedAmount/100000).toFixed(1)}L`, color: '#a78bfa' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#0f172a', borderRadius: 14, padding: '1.25rem',
                  border: '1px solid #1e293b',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', marginBottom: 6 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '1.85rem', fontWeight: 900, color: item.color, letterSpacing: '-1px' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ActivityBar>
      </PageBody>
    </Wrapper>
  );
};

export default AdminDashboard;
