import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Calendar, Filter } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import "./Analytics.css";

// --- Realistic Demo Data Generation ---
// In a true production app, this would come from a backend time-series endpoint.
// We generate highly believable correlated data for the premium aesthetic.

const revenueData = [
  { name: "Jan", revenue: 450000, users: 120 },
  { name: "Feb", revenue: 520000, users: 150 },
  { name: "Mar", revenue: 480000, users: 140 },
  { name: "Apr", revenue: 610000, users: 180 },
  { name: "May", revenue: 590000, users: 175 },
  { name: "Jun", revenue: 750000, users: 220 },
  { name: "Jul", revenue: 8450000, users: 342 }, // Current spike
];

const categoryData = [
  { name: "Technology", funding: 4200000 },
  { name: "Healthcare", funding: 2100000 },
  { name: "Education", funding: 1500000 },
  { name: "Green Tech", funding: 2800000 },
  { name: "FinTech", funding: 3400000 },
];

const roleData = [
  { name: "Investors", value: 65, color: "var(--admin-info)" },
  { name: "Startups", value: 25, color: "var(--admin-success)" },
  { name: "MNCs", value: 10, color: "var(--admin-warning)" },
];

// Custom Tooltip for Recharts
const PremiumTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-tooltip">
        <div className="premium-tooltip-label">{label}</div>
        {payload.map((entry, index) => (
          <div key={index} className="premium-tooltip-item">
            <div
              className="premium-tooltip-dot"
              style={{ backgroundColor: entry.color }}
            />
            <span
              style={{ color: "var(--admin-text-secondary)", fontWeight: 500 }}
            >
              {entry.name}:
            </span>
            <span>{formatter ? formatter(entry.value) : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  // To ensure animations trigger on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const formatCurrency = (value) => `₹${(value / 100000).toFixed(1)}L`;
  const formatCompact = (value) =>
    value >= 100000
      ? `${(value / 100000).toFixed(1)}L`
      : value.toLocaleString();

  return (
    <AdminLayout title="Analytics">
      <div className="analytics-header">
        <h1 className="analytics-title">Advanced Analytics</h1>
        <p className="analytics-subtitle">
          Deep dive into platform performance and user cohorts.
        </p>
      </div>

      <div className="analytics-controls">
        {["Overview", "Revenue", "Acquisition", "Cohorts"].map((tab) => (
          <button
            key={tab}
            className={`analytics-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="admin-btn admin-btn-secondary">
          <Filter size={14} /> Filters
        </button>
        <button className="admin-btn admin-btn-secondary">
          <Calendar size={14} /> Year to Date
        </button>
      </div>

      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Chart Section */}
          <div className="charts-grid-main">
            <div className="premium-card depth-surface chart-card">
              <div className="chart-header">
                <span className="chart-title">Platform Revenue Growth</span>
                <span className="chart-meta">
                  Monthly aggregated investments
                </span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--admin-success)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--admin-success)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--admin-border-subtle)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatCompact}
                      tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
                    />
                    <Tooltip
                      content={<PremiumTooltip formatter={formatCurrency} />}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="var(--admin-success)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: "var(--admin-success)",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="premium-card depth-surface chart-card">
              <div className="chart-header">
                <span className="chart-title">User Composition</span>
                <span className="chart-meta">Current Active</span>
              </div>
              <div className="chart-container" style={{ minHeight: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <PremiumTooltip formatter={(val) => `${val}%`} />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  {roleData.map((role, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: role.color,
                          }}
                        />
                        <span
                          style={{
                            color: "var(--admin-text-secondary)",
                            fontWeight: 500,
                          }}
                        >
                          {role.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--admin-text-primary)",
                        }}
                      >
                        {role.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Charts */}
          <div className="charts-grid-secondary">
            <div
              className="premium-card depth-surface chart-card"
              style={{ gridColumn: "span 2" }}
            >
              <div className="chart-header">
                <span className="chart-title">Funding by Category</span>
                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: "0.25rem 0.5rem" }}
                >
                  <Download size={14} />
                </button>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--admin-border-subtle)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatCompact}
                      tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--admin-surface-hover)" }}
                      content={<PremiumTooltip formatter={formatCurrency} />}
                    />
                    <Bar
                      dataKey="funding"
                      name="Total Funding"
                      fill="var(--admin-info)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="premium-card depth-surface chart-card">
              <div className="chart-header">
                <span className="chart-title">Conversion Funnel</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {[
                  { label: "Site Visitors", count: "45,210", pct: 100 },
                  { label: "Signups", count: "12,458", pct: 27.5 },
                  { label: "KYC Verified", count: "8,210", pct: 18.1 },
                  { label: "Active Investors", count: "3,402", pct: 7.5 },
                ].map((step, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        {step.label}
                      </span>
                      <span
                        style={{
                          color: "var(--admin-text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        {step.count}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "var(--admin-surface-hover)",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.pct}%` }}
                        transition={{
                          delay: 0.2 + i * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        style={{
                          height: "100%",
                          background: "var(--admin-accent)",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;
