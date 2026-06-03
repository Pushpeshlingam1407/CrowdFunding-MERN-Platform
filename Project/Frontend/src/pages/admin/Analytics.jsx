import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Activity,
  PieChart,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Flex } from "../../components/ui";
import AdminLayout from "../../components/AdminLayout";

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled(motion.div)`
  background: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
  transition: transform 0.2s;
  &:hover { transform: translateY(-4px); }
`;

const StatLabel = styled.p`
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: #A3AED0; margin-bottom: 0.5rem;
  display: flex; align-items: center; gap: 0.5rem;
`;

const StatValue = styled.h2`
  font-size: 2.25rem; font-weight: 800;
  letter-spacing: -1px; color: ${p => p.$color || '#2B3674'}; margin-bottom: 0.25rem;
`;

const StatSub = styled.p`
  font-size: 0.8rem; color: #A3AED0; font-weight: 600;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem; font-weight: 800; color: #2B3674;
  margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;
`;

const ChartCard = styled.div`
  background: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
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
  font-size: 0.85rem;
  font-weight: 700;
  color: #A3AED0;
  min-width: 100px;
  text-align: right;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 28px;
  background: #F4F7FE;
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
  font-weight: 800;
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
  border-radius: 4px;
  background: ${p => p.$color};
`;

const LegendLabel = styled.span`
  font-size: 0.85rem; color: #A3AED0; font-weight: 600;
`;

const LegendValue = styled.span`
  font-size: 0.85rem; font-weight: 800; color: #2B3674;
  margin-left: auto;
`;

const TableCard = styled.div`
  background: #ffffff;
  border: none;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 1rem;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);

  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 1.25rem 1.5rem; text-align: left;
    font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: #A3AED0; background: #ffffff;
    border-bottom: 1px solid #f1f5f9;
  }
  td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem; color: #475569;
  }
  tbody tr { transition: all 0.2s; background: #ffffff; }
  tbody tr:hover { background: #F4F7FE; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(112, 144, 176, 0.08); }
  tbody tr:last-child td { border-bottom: none; }
`;

const StatusDot = styled.span`
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.3rem 0.8rem; border-radius: 99px;
  font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
  background: ${p =>
    p.$s === 'approved' ? 'rgba(5, 205, 153, 0.1)' :
    p.$s === 'pending' ? 'rgba(255, 181, 71, 0.1)' :
    'rgba(227, 26, 26, 0.1)'};
  color: ${p =>
    p.$s === 'approved' ? '#05CD99' :
    p.$s === 'pending' ? '#FFB547' :
    '#E31A1A'};
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
  height: ${p => p.$h || '1rem'};
  width: ${p => p.$w || '100%'};
`;

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("adminToken") || localStorage.getItem("token");
  const getBaseURL = () => import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const baseURL = getBaseURL();
      const [statsRes, projRes, usersRes] = await Promise.all([
        fetch(`${baseURL}/admin/dashboard`, { headers }),
        fetch(`${baseURL}/admin/projects`, { headers }),
        fetch(`${baseURL}/admin/users`, { headers }),
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

  const categoryBreakdown = projects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const categoryColors = {
    Technology: '#4318FF', Education: '#05CD99', Healthcare: '#FFB547',
    Environment: '#01B574', Social: '#A855F7', Other: '#FF708B',
  };
  const categoryEntries = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);

  const roleBreakdown = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  const roleColors = {
    startup: '#4318FF', investor: '#05CD99', mnc: '#A855F7',
    employee: '#A3AED0', admin: '#FFB547',
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

  const donutData = categoryEntries.map(([cat, count]) => ({
    label: cat, value: count, color: categoryColors[cat] || '#A3AED0',
  }));
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0) || 1;
  let donutOffset = 0;
  const circumference = 2 * Math.PI * 70;

  const topCampaigns = [...projects]
    .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
    .slice(0, 6);

  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <AdminLayout title="Platform Analytics" subtitle="Real-time insights from live platform data">
        <div style={{ paddingTop: '1rem' }}>
          <StatsGrid>
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} $h="128px" />)}
          </StatsGrid>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Skeleton $h="320px" />
            <Skeleton $h="320px" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Platform Analytics" subtitle={`Live Platform Data — ${projects.length} campaigns, ${users.length} users`}>
      <div>
        <Flex justify="flex-end" style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={fetchAll} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#ffffff', border: 'none', borderRadius: 20,
              padding: '0.5rem 1.5rem', color: '#2B3674', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
            }}
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
        </Flex>

        <StatsGrid>
          {[
            { label: 'Total Raised', icon: <DollarSign size={14} />, value: fmt(totalRaised), sub: `of ${fmt(totalTarget)} target`, color: '#05CD99' },
            { label: 'Active Campaigns', icon: <Briefcase size={14} />, value: statusBreakdown.approved, sub: `${statusBreakdown.pending} pending review`, color: '#4318FF' },
            { label: 'Platform Users', icon: <Users size={14} />, value: stats?.totalUsers || users.length, sub: `${users.filter(u => u.isVerified).length} verified`, color: '#FFB547' },
            { label: 'Avg. Equity Offered', icon: <Activity size={14} />, value: `${avgEquity}%`, sub: `across ${projects.length} campaigns`, color: '#A855F7' },
          ].map((c, i) => (
            <StatCard key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatLabel>{c.icon} {c.label}</StatLabel>
              <StatValue $color={c.color}>{c.value}</StatValue>
              <StatSub>{c.sub}</StatSub>
            </StatCard>
          ))}
        </StatsGrid>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          <ChartCard>
            <SectionTitle><BarChart3 size={18} style={{ color: '#4318FF' }} /> Campaigns by Category</SectionTitle>
            <BarContainer>
              {categoryEntries.map(([cat, count], i) => {
                const pct = (count / (donutTotal)) * 100;
                return (
                  <BarRow key={cat}>
                    <BarLabel>{cat}</BarLabel>
                    <BarTrack>
                      <BarFill
                        $color={categoryColors[cat] || '#A3AED0'}
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
                <p style={{ color: '#A3AED0', textAlign: 'center', padding: '2rem' }}>No campaigns yet</p>
              )}
            </BarContainer>
          </ChartCard>

          <ChartCard>
            <SectionTitle><PieChart size={18} style={{ color: '#05CD99' }} /> User Composition</SectionTitle>
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
                      stroke={roleColors[role] || '#A3AED0'}
                      strokeWidth="18"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  );
                })}
                <text x="80" y="76" textAnchor="middle" fill="#2B3674" fontSize="28" fontWeight="800" transform="rotate(90, 80, 80)">
                  {users.length}
                </text>
                <text x="80" y="96" textAnchor="middle" fill="#A3AED0" fontSize="10" fontWeight="700" transform="rotate(90, 80, 80)">
                  TOTAL
                </text>
              </DonutSVG>
              <div>
                {Object.entries(roleBreakdown).map(([role, count]) => (
                  <LegendItem key={role}>
                    <LegendDot $color={roleColors[role] || '#A3AED0'} />
                    <LegendLabel>{role.charAt(0).toUpperCase() + role.slice(1)}</LegendLabel>
                    <LegendValue>{count}</LegendValue>
                  </LegendItem>
                ))}
              </div>
            </DonutContainer>
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Approved', count: statusBreakdown.approved, color: '#05CD99', icon: <CheckCircle2 size={18} /> },
            { label: 'Pending', count: statusBreakdown.pending, color: '#FFB547', icon: <Clock size={18} /> },
            { label: 'Rejected', count: statusBreakdown.rejected, color: '#E31A1A', icon: <XCircle size={18} /> },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                background: '#ffffff', border: 'none',
                borderRadius: 20, padding: '1.5rem',
                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: s.color, marginBottom: '0.75rem' }}>
                {s.icon}
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#2B3674', letterSpacing: '-1px' }}>{s.count}</p>
              <p style={{ fontSize: '0.8rem', color: '#A3AED0', fontWeight: 500 }}>
                {projects.length ? `${((s.count / projects.length) * 100).toFixed(0)}% of all campaigns` : '—'}
              </p>
            </motion.div>
          ))}
        </div>

        <SectionTitle style={{ marginTop: '1.5rem' }}>
          <TrendingUp size={18} style={{ color: '#FFB547' }} /> Top Campaigns by Funding
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
                      <span style={{ fontWeight: 800, color: '#2B3674' }}>{p.title}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#A3AED0' }}>{p.creator?.name || '—'}</td>
                    <td>
                      <span style={{
                        padding: '0.3rem 0.8rem', borderRadius: 99,
                        fontSize: '0.72rem', fontWeight: 700,
                        background: (categoryColors[p.category] || '#A3AED0') + '1A',
                        color: categoryColors[p.category] || '#A3AED0',
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#2B3674' }}>{fmt(p.targetAmount)}</td>
                    <td style={{ fontWeight: 800, color: '#05CD99' }}>{fmt(p.currentAmount || 0)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: 8, background: '#F4F7FE', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4318FF, #868CFF)', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#A3AED0', minWidth: '36px' }}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td><StatusDot $s={p.status}>{p.status}</StatusDot></td>
                  </tr>
                );
              })}
              {topCampaigns.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#A3AED0', fontWeight: 500 }}>No campaigns yet</td></tr>
              )}
            </tbody>
          </table>
        </TableCard>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;

