import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "../../store/authStore";
import AdminLayout from "../../components/AdminLayout";

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
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
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -1px;
  color: #0f172a;
  margin-bottom: 0.5rem;

  span {
    color: #2563eb;
  }
`;

const WelcomeSub = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
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
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -1px;
  color: #0f172a;
  margin-bottom: 0.25rem;
`;

const StatSub = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const ModuleCard = styled(motion.div)`
  background: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 22px 48px rgba(112, 144, 176, 0.18);
  }
`;

const ModuleIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  margin-bottom: 1.25rem;
`;

const ModuleTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

const ModuleDesc = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;

const ModuleLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(p) => p.$color};
`;

const ActivityBar = styled.div`
  background: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
`;

const ActivityTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: ${(p) => p.$h || "1rem"};
  width: ${(p) => p.$w || "100%"};
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(`${getBaseURL()}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStats(data.stats);
    } catch {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
    toast.info("Admin session ended");
  };

  const statCards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          sub: "Registered accounts",
          icon: <Users size={20} />,
          from: "#1d4ed8",
          to: "#3b82f6",
        },
        {
          label: "Total Campaigns",
          value: stats.totalProjects.toLocaleString(),
          sub: `${stats.approvedProjects} approved`,
          icon: <Briefcase size={20} />,
          from: "#065f46",
          to: "#10b981",
        },
        {
          label: "Pending Review",
          value: stats.pendingProjects.toLocaleString(),
          sub: "Awaiting moderation",
          icon: <Clock size={20} />,
          from: "#92400e",
          to: "#f59e0b",
        },
        {
          label: "Total Invested",
          value: `₹${(stats.totalInvestedAmount / 100000).toFixed(1)}L`,
          sub: `${stats.totalInvestments} investments`,
          icon: <DollarSign size={20} />,
          from: "#4c1d95",
          to: "#8b5cf6",
        },
      ]
    : [];

  const modules = [
    {
      title: "Campaign Moderation",
      desc: "Approve, reject, and manage all startup campaigns awaiting verification.",
      icon: <Briefcase size={22} />,
      color: "#38bdf8",
      bg: "rgba(56,189,248,0.1)",
      path: "/admin/projects",
    },
    {
      title: "User Ecosystem",
      desc: "Manage startups, investors, MNCs and platform members.",
      icon: <Users size={22} />,
      color: "#4ade80",
      bg: "rgba(74,222,128,0.1)",
      path: "/admin/users",
    },
    {
      title: "Platform Analytics",
      desc: "Deep-dive into investment trends, growth metrics and KPIs.",
      icon: <BarChart3 size={22} />,
      color: "#fb923c",
      bg: "rgba(251,146,60,0.1)",
      path: "/admin/analytics",
    },
    {
      title: "Compliance Reports",
      desc: "Review bug reports, fraud allegations and user complaints.",
      icon: <AlertCircle size={22} />,
      color: "#f87171",
      bg: "rgba(248,113,113,0.1)",
      path: "/admin/complaints",
    },
    {
      title: "Admin Settings",
      desc: "Configure platform-wide policies, security and access.",
      icon: <Settings size={22} />,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      path: "/admin/settings",
    },
    {
      title: "Financial Activity",
      desc: "Monitor platform-wide fundraising and investments.",
      icon: <DollarSign size={22} />,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      path: "/admin/financials",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div>
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back,&nbsp;<span>{adminUser?.name || "Admin"}</span>
          </WelcomeTitle>
          <WelcomeSub>
            Here's what's happening on the StartupFund platform right now.
          </WelcomeSub>
        </WelcomeSection>

        <StatsGrid>
          {loadingStats
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} style={{ borderRadius: 18, overflow: "hidden" }}>
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

        <h2
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "1.25rem",
          }}
        >
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

        <ActivityBar>
          <ActivityTitle>
            <TrendingUp size={20} style={{ color: "#2563eb" }} />
            Platform Summary
          </ActivityTitle>
          {loadingStats ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "1.5rem",
              }}
            >
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} $h="80px" />
                ))}
            </div>
          ) : (
            stats && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: "1.5rem",
                }}
              >
                {[
                  {
                    label: "Approved Ventures",
                    value: stats.approvedProjects,
                    color: "#059669",
                  },
                  {
                    label: "Pending KYC Docs",
                    value: stats.pendingDocuments,
                    color: "#d97706",
                  },
                  {
                    label: "Total Investments",
                    value: stats.totalInvestments,
                    color: "#2563eb",
                  },
                  {
                    label: "Total Raised",
                    value: `₹${(stats.totalInvestedAmount / 100000).toFixed(1)}L`,
                    color: "#7c3aed",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 12,
                      padding: "1.5rem",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#64748b",
                        marginBottom: 8,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: item.color,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </ActivityBar>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
