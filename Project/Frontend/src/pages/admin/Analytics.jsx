import React, { useState, useEffect } from "react";

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
import "./Analytics.css";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");
  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchAll();
  }, []);

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
    Technology: "#0071e3",
    Education: "#10b981",
    Healthcare: "#f59e0b",
    Environment: "#05cd99",
    Social: "#8b5cf6",
    Other: "#6e6e73",
  };
  const categoryEntries = Object.entries(categoryBreakdown).sort(
    (a, b) => b[1] - a[1],
  );

  const roleBreakdown = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  const roleColors = {
    startup: "#0071e3",
    investor: "#10b981",
    mnc: "#8b5cf6",
    employee: "#6e6e73",
    admin: "#f59e0b",
  };

  const statusBreakdown = {
    approved: projects.filter((p) => p.status === "approved").length,
    pending: projects.filter((p) => p.status === "pending").length,
    rejected: projects.filter((p) => p.status === "rejected").length,
  };

  const totalTarget = projects.reduce((s, p) => s + (p.targetAmount || 0), 0);
  const totalRaised = projects.reduce((s, p) => s + (p.currentAmount || 0), 0);
  const avgEquity = projects.length
    ? (
        projects.reduce((s, p) => s + (p.equity || 0), 0) / projects.length
      ).toFixed(1)
    : 0;

  const donutData = categoryEntries.map(([cat, count]) => ({
    label: cat,
    value: count,
    color: categoryColors[cat] || "#A3AED0",
  }));
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0) || 1;
  let donutOffset = 0;
  const circumference = 2 * Math.PI * 70;

  const topCampaigns = [...projects]
    .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
    .slice(0, 6);

  const fmt = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : `₹${n.toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <AdminLayout
        title="Platform Analytics"
        subtitle="Real-time insights from live platform data"
      >
        <div className="analytics-loading-pad">
          <div className="analytics-stats-grid">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  className="analytics-skeleton"
                  key={i}
                  style={{ height: "128px" }}
                />
              ))}
          </div>
          <div className="chart-grid-2-col">
            <div className="analytics-skeleton" style={{ height: "320px" }} />
            <div className="analytics-skeleton" style={{ height: "320px" }} />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Platform Analytics"
      subtitle={`Live Platform Data — ${projects.length} campaigns, ${users.length} users`}
    >
      <div>
        <Flex justify="flex-end" className="flex-end-mb">
          <button onClick={fetchAll} className="btn-refresh-data">
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
            Data
          </button>
        </Flex>

        <div className="analytics-stats-grid">
          {[
            {
              label: "Total Raised",
              icon: <DollarSign size={14} />,
              value: fmt(totalRaised),
              sub: `of ${fmt(totalTarget)} target`,
              color: "#10b981",
            },
            {
              label: "Active Campaigns",
              icon: <Briefcase size={14} />,
              value: statusBreakdown.approved,
              sub: `${statusBreakdown.pending} pending review`,
              color: "#0071e3",
            },
            {
              label: "Platform Users",
              icon: <Users size={14} />,
              value: stats?.totalUsers || users.length,
              sub: `${users.filter((u) => u.isVerified).length} verified`,
              color: "#f59e0b",
            },
            {
              label: "Avg. Equity Offered",
              icon: <Activity size={14} />,
              value: `${avgEquity}%`,
              sub: `across ${projects.length} campaigns`,
              color: "#8b5cf6",
            },
          ].map((c, i) => (
            <motion.div
              className="analytics-stat-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="analytics-stat-label">
                {c.icon} {c.label}
              </p>
              <h2 className="analytics-stat-value" style={{ color: c.color }}>
                {c.value}
              </h2>
              <p className="analytics-stat-sub">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="chart-grid-2-col">
          <div className="analytics-chart-card">
            <h3 className="analytics-section-title">
              <BarChart3 size={18} className="icon-blue" /> Campaigns by
              Category
            </h3>
            <div className="analytics-bar-container">
              {categoryEntries.map(([cat, count], i) => {
                const pct = (count / donutTotal) * 100;
                return (
                  <div className="analytics-bar-row" key={cat}>
                    <span className="analytics-bar-label">{cat}</span>
                    <div className="analytics-bar-track">
                      <motion.div
                        className="analytics-bar-fill"
                        style={{
                          background: `linear-gradient(90deg, ${categoryColors[cat] || "#94a3b8"}88, ${categoryColors[cat] || "#94a3b8"})`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(pct, 8)}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        {count}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
              {categoryEntries.length === 0 && (
                <p className="empty-text-center">No campaigns yet</p>
              )}
            </div>
          </div>

          <div className="analytics-chart-card">
            <h3 className="analytics-section-title">
              <PieChart size={18} className="icon-green" /> User Composition
            </h3>
            <div className="analytics-donut-container">
              <svg className="analytics-donut-svg" viewBox="0 0 160 160">
                {Object.entries(roleBreakdown).map(([role, count]) => {
                  const pct = count / (users.length || 1);
                  const dashLength = pct * circumference;
                  const offset = donutOffset;
                  donutOffset += dashLength;
                  return (
                    <circle
                      key={role}
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={roleColors[role] || "#6e6e73"}
                      strokeWidth="18"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  );
                })}
                <text
                  x="80"
                  y="76"
                  textAnchor="middle"
                  fill="#191919"
                  fontSize="28"
                  fontWeight="800"
                  transform="rotate(90, 80, 80)"
                  className="text-sans"
                >
                  {users.length}
                </text>
                <text
                  x="80"
                  y="96"
                  textAnchor="middle"
                  fill="#86868b"
                  fontSize="10"
                  fontWeight="700"
                  transform="rotate(90, 80, 80)"
                  className="text-sans"
                >
                  TOTAL
                </text>
              </svg>
              <div>
                {Object.entries(roleBreakdown).map(([role, count]) => (
                  <div className="analytics-legend-item" key={role}>
                    <div
                      className="analytics-legend-dot"
                      style={{ background: roleColors[role] || "#94a3b8" }}
                    />
                    <span className="analytics-legend-label">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <span className="analytics-legend-value">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="status-grid-3-col">
          {[
            {
              label: "Approved",
              count: statusBreakdown.approved,
              color: "#10b981",
              icon: <CheckCircle2 size={18} />,
            },
            {
              label: "Pending",
              count: statusBreakdown.pending,
              color: "#f59e0b",
              icon: <Clock size={18} />,
            },
            {
              label: "Rejected",
              count: statusBreakdown.rejected,
              color: "#ef4444",
              icon: <XCircle size={18} />,
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="status-card-inner"
            >
              <div
                className="status-card-header"
                style={{
                  color: s.color,
                }}
              >
                {s.icon}
                <span className="status-card-title">{s.label}</span>
              </div>
              <p className="status-card-value">{s.count}</p>
              <p className="status-card-sub">
                {projects.length
                  ? `${((s.count / projects.length) * 100).toFixed(0)}% of all campaigns`
                  : "—"}
              </p>
            </motion.div>
          ))}
        </div>

        <h3 className="analytics-section-title mt-1-5">
          <TrendingUp size={18} className="icon-yellow" /> Top Campaigns by
          Funding
        </h3>
        <div className="analytics-table-card">
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
                const pct = p.targetAmount
                  ? Math.min(
                      100,
                      ((p.currentAmount || 0) / p.targetAmount) * 100,
                    )
                  : 0;
                return (
                  <tr key={p._id}>
                    <td>
                      <span className="text-heavy-dark">{p.title}</span>
                    </td>
                    <td className="text-medium-light">
                      {p.creator?.name || "—"}
                    </td>
                    <td>
                      <span
                        className="category-badge-table"
                        style={{
                          background:
                            (categoryColors[p.category] || "#6e6e73") + "1A",
                          color: categoryColors[p.category] || "#6e6e73",
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="text-heavy-dark-mono">
                      {fmt(p.targetAmount)}
                    </td>
                    <td className="text-amount-success">
                      {fmt(p.currentAmount || 0)}
                    </td>
                    <td>
                      <div className="progress-wrapper-table">
                        <div className="progress-track-table">
                          <div
                            className="progress-fill-table"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="progress-pct-text">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`analytics-status-dot ${p.status === "approved" ? "approved" : p.status === "pending" ? "pending" : "rejected"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {topCampaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-cell-empty">
                    No campaigns yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
