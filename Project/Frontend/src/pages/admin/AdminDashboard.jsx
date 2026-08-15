import React, { useState, useEffect } from "react";
import { motion, useAnimation, animate } from "framer-motion";
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CreditCard,
  UserPlus,
  ShieldCheck,
  Building,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminDashboard.css";
import useAuthStore from "../../store/authStore";
import { toast } from "sonner";

// Animated Number Component
const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // Custom realistic ease
      onUpdate(v) {
        setDisplayValue(v);
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

// Mini SVG Sparkline Component
const Sparkline = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (((val - min) / range) * (100 - padding * 2) + padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className="kpi-sparkline"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill={`url(#grad-${color})`}
        points={`0,100 ${points} 100,100`}
      />
    </svg>
  );
};

// No fake activity generation. Activities are fetched from real investments.
const AdminDashboard = () => {
  const { adminUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, invRes] = await Promise.all([
          fetch(`${getBaseURL()}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${getBaseURL()}/admin/investments`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        const statsData = await statsRes.json();
        const invData = await invRes.json();

        if (statsData.success) {
          setStats({
            users: statsData.stats.totalUsers,
            revenue: statsData.stats.totalInvestedAmount,
            campaigns: statsData.stats.totalProjects,
            totalInvestments: statsData.stats.totalInvestments,
          });
        }

        if (invData.success && invData.investments) {
          // Top transactions (real)
          const sortedInvs = [...invData.investments].sort(
            (a, b) => b.amount - a.amount,
          );
          setTransactions(sortedInvs.slice(0, 5));

          const recent = invData.investments.slice(0, 6).map((inv) => ({
            id: inv.id || Math.random().toString(),
            name: inv.investor?.name || "Investor",
            text: `invested ₹${inv.amount.toLocaleString()} in ${inv.project?.title || "a campaign"}`,
            time: new Date(inv.createdAt).toLocaleDateString(),
            icon: DollarSign,
            color: "#10B981",
            bg: "var(--admin-success-bg)",
          }));
          setActivities(recent);
        }
      } catch (err) {
        toast.error("Failed to sync live data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const kpiData = stats
    ? [
        {
          title: "Total Revenue",
          value: stats.revenue / 100000,
          prefix: "₹",
          suffix: "L",
          decimals: 1,
          change: "Real-time",
          isPositive: true,
          sub: "Total invested capital",
          icon: DollarSign,
          color: "var(--admin-success)",
          bg: "var(--admin-success-bg)",
        },
        {
          title: "Active Investors",
          value: stats.users,
          prefix: "",
          suffix: "",
          decimals: 0,
          change: "Real-time",
          isPositive: true,
          sub: "Registered users",
          icon: Users,
          color: "var(--admin-info)",
          bg: "var(--admin-info-bg)",
        },
        {
          title: "Active Campaigns",
          value: stats.campaigns,
          prefix: "",
          suffix: "",
          decimals: 0,
          change: "Real-time",
          isPositive: true,
          sub: "Total projects",
          icon: Briefcase,
          color: "var(--admin-warning)",
          bg: "var(--admin-warning-bg)",
        },
        {
          title: "Total Investments",
          value: stats.totalInvestments,
          prefix: "",
          suffix: "",
          decimals: 0,
          change: "Real-time",
          isPositive: true,
          sub: "Completed transactions",
          icon: Activity,
          color: "#8B5CF6",
          bg: "rgba(139,92,246,0.1)",
        },
      ]
    : [];

  return (
    <AdminLayout title="Overview">
      {/* HERO HEADER */}
      <div className="dashboard-hero">
        <div className="dashboard-title-area">
          <h1>Platform Overview</h1>
          <p>
            Real-time metrics for{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="admin-btn admin-btn-secondary">
            <Download size={16} /> Export Report
          </button>
          <button className="admin-btn admin-btn-primary">
            <CreditCard size={16} /> Manage Payouts
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      {loading ? (
        <div className="kpi-grid">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="premium-card depth-surface premium-skeleton"
              style={{ height: "140px" }}
            />
          ))}
        </div>
      ) : (
        <div className="kpi-grid">
          {kpiData.map((kpi, i) => (
            <motion.div
              key={i}
              className="premium-card depth-surface premium-card-hover kpi-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="kpi-header">
                <span className="kpi-title">{kpi.title}</span>
                <div
                  className="kpi-icon"
                  style={{ background: kpi.bg, color: kpi.color }}
                >
                  <kpi.icon size={16} />
                </div>
              </div>
              <div className="kpi-value-container">
                <div className="kpi-value">
                  <AnimatedNumber
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.decimals}
                  />
                </div>
                <div
                  className={`kpi-change ${kpi.isPositive ? "positive" : "negative"}`}
                >
                  {kpi.isPositive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="kpi-sub">{kpi.sub}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* OPEN CANVAS AREA */}
      <div className="dashboard-canvas">
        {/* We leave the left area open for the Analytics Module or Table, here we put a high-level summary table */}
        <div className="premium-card depth-surface" style={{ padding: "0" }}>
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--admin-border-subtle)",
            }}
          >
            <h2 className="canvas-section-title" style={{ margin: 0 }}>
              Recent High-Value Transactions
            </h2>
          </div>
          <div
            className="premium-table-wrapper"
            style={{
              border: "none",
              borderRadius: "0 0 var(--admin-radius-lg) var(--admin-radius-lg)",
            }}
          >
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((t, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {t.investor?.name || "Unknown User"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          {t.investor?.email || "N/A"}
                        </div>
                      </td>
                      <td>{t.project?.title || "Unknown Campaign"}</td>
                      <td
                        style={{
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${t.status === "completed" ? "success" : "warning"}`}
                        >
                          {t.status || "completed"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="premium-card depth-surface">
          <h2 className="canvas-section-title">
            <span
              className="admin-live-badge"
              style={{ position: "relative", top: 0, right: 0 }}
            />{" "}
            Live Activity
          </h2>
          <div className="activity-feed">
            {activities.map((act) => (
              <motion.div
                key={act.id}
                className="activity-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="activity-icon-wrap"
                  style={{ background: act.bg, color: act.color }}
                >
                  <act.icon size={16} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {act.name} <span>{act.text}</span>
                  </div>
                  <div className="activity-meta">{act.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
