import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  ArrowLeft,
  Download,
  Activity,
  PieChart,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { Container, Flex } from "../../components/ui";

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  background: #080e1a;
  padding: 0;
`;

const TopNav = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem 0;
`;

const PageBody = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
`;

const BackBtn = styled.button`
  background: none;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  &:hover { border-color: #64748b; color: #e2e8f0; }
`;

const Heading = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: #f8fafc;
  margin-bottom: 0.5rem;
`;

const SubHeading = styled.p`
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
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
    top: -40%; right: -20%;
    width: 120px; height: 120px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }
`;

const StatLabel = styled.p`
  font-size: 0.72rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.2px;
  color: rgba(255,255,255,0.55); margin-bottom: 0.75rem;
  display: flex; align-items: center; gap: 0.5rem;
`;

const StatValue = styled.h2`
  font-size: 2.25rem; font-weight: 900;
  letter-spacing: -1.5px; color: #fff; margin-bottom: 0.25rem;
`;

const StatSub = styled.p`
  font-size: 0.78rem; color: rgba(255,255,255,0.45);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem; font-weight: 800; color: #e2e8f0;
  margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;
`;

const ChartCard = styled.div`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 2rem;
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BarLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #94a3b8;
  min-width: 100px;
  text-align: right;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 28px;
  background: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, ${p => p.$color}88, ${p => p.$color});
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
`;

const DonutContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const DonutSVG = styled.svg`
  width: 180px;
  height: 180px;
  transform: rotate(-90deg);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const LegendDot = styled.div`
  width: 12px; height: 12px;
  border-radius: 3px;
  background: ${p => p.$color};
`;

const LegendLabel = styled.span`
  font-size: 0.85rem; color: #94a3b8;
`;

const LegendValue = styled.span`
  font-size: 0.85rem; font-weight: 700; color: #e2e8f0;
  margin-left: auto;
`;

const TableCard = styled.div`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 18px;
  overflow: hidden;
  margin-top: 2rem;

  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 1rem 1.5rem; text-align: left;
    font-size: 0.7rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 1.2px;
    color: #475569; background: #0f172a;
    border-bottom: 1px solid #1e293b;
  }
  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #1e293b;
    font-size: 0.88rem; color: #cbd5e1;
  }
  tbody tr { transition: background 0.15s; }
  tbody tr:hover { background: #1a2332; }
  tbody tr:last-child td { border-bottom: none; }
`;

const StatusDot = styled.span`
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.25rem 0.65rem; border-radius: 99px;
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
  background: ${p =>
    p.$s === 'approved' ? 'rgba(34,197,94,0.12)' :
    p.$s === 'pending' ? 'rgba(251,191,36,0.12)' :
    'rgba(239,68,68,0.12)'};
  color: ${p =>
    p.$s === 'approved' ? '#4ade80' :
    p.$s === 'pending' ? '#fbbf24' :
    '#f87171'};
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, #1e293b 25%, #263349 50%, #1e293b 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: ${p => p.$h || '1rem'};
  width: ${p => p.$w || '100%'};
`;

const BASE = "http://localhost:5000";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [statsRes, projRes, usersRes] = await Promise.all([
        fetch(`${BASE}/api/admin/dashboard`, { headers }),
        fetch(`${BASE}/api/admin/projects`, { headers }),
        fetch(`${BASE}/api/admin/users`, { headers }),
      ]);

      const statsData = await statsRes.json();
      const projData = await projRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) setStats(statsData.stats);
      setProjects(Array.isArray(projData.projects) ? projData.projects : []);
      setUsers(Array.isArray(usersData.users) ? usersData.users : []);
    } catch {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Derived metrics
  const categoryBreakdown = projects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const categoryColors = {
    Technology: '#38bdf8', Education: '#4ade80', Healthcare: '#f87171',
    Environment: '#fbbf24', Social: '#a78bfa', Other: '#fb923c',
  };
  const categoryEntries = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);

  const roleBreakdown = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  const roleColors = {
    startup: '#38bdf8', investor: '#4ade80', mnc: '#c084fc',
    employee: '#94a3b8', admin: '#fbbf24',
  };

  const statusBreakdown = {
    approved: projects.filter(p => p.status === 'approved').length,
    pending: projects.filter(p => p.status === 'pending').length,
    rejected: projects.filter(p => p.status === 'rejected').length,
  };

  const totalTarget = projects.reduce((s, p) => s + (p.targetAmount || 0), 0);
  const totalRaised = projects.reduce((s, p) => s + (p.currentAmount || 0), 0);
  const avgEquity = projects.length
    ? (projects.reduce((s, p) => s + (p.equity || 0), 0) / projects.length).toFixed(1)
    : 0;

  // Donut chart
  const donutData = categoryEntries.map(([cat, count]) => ({
    label: cat, value: count, color: categoryColors[cat] || '#64748b',
  }));
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0) || 1;
  let donutOffset = 0;
  const circumference = 2 * Math.PI * 70;

  // Top campaigns by funding
  const topCampaigns = [...projects]
    .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
    .slice(0, 6);

  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <Wrapper>
        <PageBody style={{ paddingTop: '3rem' }}>
          <Skeleton $h="40px" $w="300px" style={{ marginBottom: '2rem' }} />
          <StatsGrid>
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} $h="128px" />)}
          </StatsGrid>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Skeleton $h="320px" />
            <Skeleton $h="320px" />
          </div>
        </PageBody>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <TopNav>
        <BackBtn onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={15} /> Back to Overview
        </BackBtn>
        <Flex justify="space-between" style={{ marginBottom: '0.5rem' }}>
          <div>
            <Heading>Platform Analytics</Heading>
            <SubHeading>
              Real-time insights from live platform data — {projects.length} campaigns, {users.length} users.
            </SubHeading>
          </div>
          <BackBtn onClick={fetchAll} style={{ marginBottom: 0 }}>
            <RefreshCw size={14} /> Refresh
          </BackBtn>
        </Flex>
      </TopNav>

      <PageBody>
        {/* Stat Cards */}
        <StatsGrid>
          {[
            { label: 'Total Raised', icon: <DollarSign size={14} />, value: fmt(totalRaised), sub: `of ${fmt(totalTarget)} target`, from: '#065f46', to: '#10b981' },
            { label: 'Active Campaigns', icon: <Briefcase size={14} />, value: statusBreakdown.approved, sub: `${statusBreakdown.pending} pending review`, from: '#1d4ed8', to: '#3b82f6' },
            { label: 'Platform Users', icon: <Users size={14} />, value: stats?.totalUsers || users.length, sub: `${users.filter(u => u.isVerified).length} verified`, from: '#92400e', to: '#f59e0b' },
            { label: 'Avg. Equity Offered', icon: <Activity size={14} />, value: `${avgEquity}%`, sub: `across ${projects.length} campaigns`, from: '#4c1d95', to: '#8b5cf6' },
          ].map((c, i) => (
            <StatCard key={i} $from={c.from} $to={c.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatLabel>{c.icon} {c.label}</StatLabel>
              <StatValue>{c.value}</StatValue>
              <StatSub>{c.sub}</StatSub>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          {/* Category Bar Chart */}
          <ChartCard>
            <SectionTitle><BarChart3 size={18} style={{ color: '#38bdf8' }} /> Campaigns by Category</SectionTitle>
            <BarContainer>
              {categoryEntries.map(([cat, count], i) => {
                const pct = (count / (donutTotal)) * 100;
                return (
                  <BarRow key={cat}>
                    <BarLabel>{cat}</BarLabel>
                    <BarTrack>
                      <BarFill
                        $color={categoryColors[cat] || '#64748b'}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(pct, 8)}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        {count}
                      </BarFill>
                    </BarTrack>
                  </BarRow>
                );
              })}
              {categoryEntries.length === 0 && (
                <p style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>No campaigns yet</p>
              )}
            </BarContainer>
          </ChartCard>

          {/* User Composition Donut */}
          <ChartCard>
            <SectionTitle><PieChart size={18} style={{ color: '#4ade80' }} /> User Composition</SectionTitle>
            <DonutContainer>
              <DonutSVG viewBox="0 0 160 160">
                {Object.entries(roleBreakdown).map(([role, count]) => {
                  const pct = count / (users.length || 1);
                  const dashLength = pct * circumference;
                  const offset = donutOffset;
                  donutOffset += dashLength;
                  return (
                    <circle
                      key={role}
                      cx="80" cy="80" r="70"
                      fill="none"
                      stroke={roleColors[role] || '#64748b'}
                      strokeWidth="18"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  );
                })}
                <text x="80" y="76" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="900" transform="rotate(90, 80, 80)">
                  {users.length}
                </text>
                <text x="80" y="96" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" transform="rotate(90, 80, 80)">
                  TOTAL
                </text>
              </DonutSVG>
              <div>
                {Object.entries(roleBreakdown).map(([role, count]) => (
                  <LegendItem key={role}>
                    <LegendDot $color={roleColors[role] || '#64748b'} />
                    <LegendLabel>{role.charAt(0).toUpperCase() + role.slice(1)}</LegendLabel>
                    <LegendValue>{count}</LegendValue>
                  </LegendItem>
                ))}
              </div>
            </DonutContainer>
          </ChartCard>
        </div>

        {/* Campaign Status Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Approved', count: statusBreakdown.approved, color: '#4ade80', icon: <CheckCircle2 size={18} /> },
            { label: 'Pending', count: statusBreakdown.pending, color: '#fbbf24', icon: <Clock size={18} /> },
            { label: 'Rejected', count: statusBreakdown.rejected, color: '#f87171', icon: <XCircle size={18} /> },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                background: '#111827', border: '1px solid #1e293b',
                borderRadius: 18, padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: s.color, marginBottom: '0.75rem' }}>
                {s.icon}
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>{s.count}</p>
              <p style={{ fontSize: '0.78rem', color: '#475569' }}>
                {projects.length ? `${((s.count / projects.length) * 100).toFixed(0)}% of all campaigns` : '—'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Top Campaigns Table */}
        <SectionTitle style={{ marginTop: '1rem' }}>
          <TrendingUp size={18} style={{ color: '#fb923c' }} /> Top Campaigns by Funding
        </SectionTitle>
        <TableCard>
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Creator</th>
                <th>Category</th>
                <th>Target</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topCampaigns.map((p, i) => {
                const pct = p.targetAmount ? Math.min(100, ((p.currentAmount || 0) / p.targetAmount) * 100) : 0;
                return (
                  <tr key={p._id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{p.title}</span>
                    </td>
                    <td>{p.creator?.name || '—'}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 99,
                        fontSize: '0.72rem', fontWeight: 700,
                        background: (categoryColors[p.category] || '#64748b') + '18',
                        color: categoryColors[p.category] || '#64748b',
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{fmt(p.targetAmount)}</td>
                    <td style={{ fontWeight: 700, color: '#4ade80' }}>{fmt(p.currentAmount || 0)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: '#38bdf8', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', minWidth: '36px' }}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td><StatusDot $s={p.status}>{p.status}</StatusDot></td>
                  </tr>
                );
              })}
              {topCampaigns.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>No campaigns yet</td></tr>
              )}
            </tbody>
          </table>
        </TableCard>

        {/* Funding Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '2rem' }}>
          <ChartCard>
            <SectionTitle><DollarSign size={18} style={{ color: '#fbbf24' }} /> Funding by Category</SectionTitle>
            <BarContainer>
              {Object.entries(
                projects.reduce((acc, p) => {
                  acc[p.category] = (acc[p.category] || 0) + (p.currentAmount || 0);
                  return acc;
                }, {})
              ).sort((a, b) => b[1] - a[1]).map(([cat, amount], i) => {
                const maxAmt = Math.max(...Object.values(
                  projects.reduce((acc, p) => {
                    acc[p.category] = (acc[p.category] || 0) + (p.currentAmount || 0);
                    return acc;
                  }, {})
                ), 1);
                return (
                  <BarRow key={cat}>
                    <BarLabel>{cat}</BarLabel>
                    <BarTrack>
                      <BarFill
                        $color={categoryColors[cat] || '#64748b'}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max((amount / maxAmt) * 100, 8)}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        {fmt(amount)}
                      </BarFill>
                    </BarTrack>
                  </BarRow>
                );
              })}
            </BarContainer>
          </ChartCard>

          <ChartCard>
            <SectionTitle><Activity size={18} style={{ color: '#a78bfa' }} /> Platform Health</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Funding Rate', value: totalTarget ? `${((totalRaised / totalTarget) * 100).toFixed(1)}%` : '0%', pct: totalTarget ? (totalRaised / totalTarget) * 100 : 0, color: '#4ade80' },
                { label: 'Approval Rate', value: projects.length ? `${((statusBreakdown.approved / projects.length) * 100).toFixed(0)}%` : '0%', pct: projects.length ? (statusBreakdown.approved / projects.length) * 100 : 0, color: '#38bdf8' },
                { label: 'User Verification', value: users.length ? `${((users.filter(u => u.isVerified).length / users.length) * 100).toFixed(0)}%` : '0%', pct: users.length ? (users.filter(u => u.isVerified).length / users.length) * 100 : 0, color: '#fbbf24' },
                { label: 'Campaign Completion', value: projects.length ? `${((projects.filter(p => p.isLocked).length / projects.length) * 100).toFixed(0)}%` : '0%', pct: projects.length ? (projects.filter(p => p.isLocked).length / projects.length) * 100 : 0, color: '#a78bfa' },
              ].map((m, i) => (
                <div key={i}>
                  <Flex justify="space-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#94a3b8' }}>{m.label}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: m.color }}>{m.value}</span>
                  </Flex>
                  <div style={{ height: 8, background: '#0f172a', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: m.color, borderRadius: 4 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(m.pct, 100)}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </PageBody>
    </Wrapper>
  );
};

export default AdminAnalytics;
