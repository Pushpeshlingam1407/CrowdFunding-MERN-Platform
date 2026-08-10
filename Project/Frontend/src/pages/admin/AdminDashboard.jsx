import React, { useState, useEffect } from "react";

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
import "./AdminDashboard.css";

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
      color: "#0071e3",
      bg: "rgba(0,113,227,0.08)",
      path: "/admin/projects",
    },
    {
      title: "User Ecosystem",
      desc: "Manage startups, investors, MNCs and platform members.",
      icon: <Users size={22} />,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      path: "/admin/users",
    },
    {
      title: "Platform Analytics",
      desc: "Deep-dive into investment trends, growth metrics and KPIs.",
      icon: <BarChart3 size={22} />,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      path: "/admin/analytics",
    },
    {
      title: "Compliance Reports",
      desc: "Review bug reports, fraud allegations and user complaints.",
      icon: <AlertCircle size={22} />,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      path: "/admin/complaints",
    },
    {
      title: "Admin Settings",
      desc: "Configure platform-wide policies, security and access.",
      icon: <Settings size={22} />,
      color: "#6e6e73",
      bg: "rgba(110,110,115,0.08)",
      path: "/admin/settings",
    },
    {
      title: "Financial Activity",
      desc: "Monitor platform-wide fundraising and investments.",
      icon: <DollarSign size={22} />,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      path: "/admin/financials",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-page-body">
        <div className="admin-welcome-section">
          <h1 className="admin-welcome-title">
            Welcome back,&nbsp;<span>{adminUser?.name || "Admin"}</span>
          </h1>
          <p className="admin-welcome-sub">
            Here's what's happening on the StartupFund platform right now.
          </p>
        </div>

        <div className="admin-stats-grid">
          {loadingStats
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="skeleton-wrapper">
                    <div
                      className="admin-skeleton"
                      style={{ height: "128px" }}
                    />
                  </div>
                ))
            : statCards.map((card, i) => (
                <motion.div
                  className="admin-stat-card"
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <p className="admin-stat-label">{card.label}</p>
                  <h2 className="admin-stat-value">{card.value}</h2>
                  <p className="admin-stat-sub">{card.sub}</p>
                </motion.div>
              ))}
        </div>

        <h2 className="admin-modules-title">Admin Modules</h2>
        <div className="admin-modules-grid">
          {modules.map((m, i) => (
            <motion.div
              className="admin-module-card"
              key={i}
              onClick={() => navigate(m.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <div
                className="admin-module-icon"
                style={{ background: m.bg, color: m.color }}
              >
                {m.icon}
              </div>
              <h3 className="admin-module-title">{m.title}</h3>
              <p className="admin-module-desc">{m.desc}</p>
              <div className="admin-module-link" style={{ color: m.color }}>
                Manage <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="admin-activity-bar">
          <h3 className="admin-activity-title">
            <TrendingUp size={20} className="icon-dark" />
            Platform Summary
          </h3>
          {loadingStats ? (
            <div className="summary-grid">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    className="admin-skeleton"
                    key={i}
                    style={{ height: "80px" }}
                  />
                ))}
            </div>
          ) : (
            stats && (
              <div className="summary-grid">
                {[
                  {
                    label: "Total Users",
                    value: stats.totalUsers,
                    colorClass: "text-color-dark",
                  },
                  {
                    label: "Approved Projects",
                    value: stats.approvedProjects,
                    colorClass: "text-color-green",
                  },
                  {
                    label: "Total Investments",
                    value: stats.totalInvestments,
                    colorClass: "text-color-blue",
                  },
                  {
                    label: "Total Raised",
                    value: `₹${(stats.totalInvestedAmount / 100000).toFixed(1)}L`,
                    colorClass: "text-color-purple",
                  },
                ].map((item, i) => (
                  <div key={i} className="summary-card">
                    <p className="summary-card-label">{item.label}</p>
                    <p className={`summary-card-value ${item.colorClass}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
