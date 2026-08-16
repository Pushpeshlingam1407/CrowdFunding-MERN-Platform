import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LayoutDashboard,
  Briefcase,
  Settings,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Edit,
  Building2,
  Users,
  Target,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Flex } from "../components/ui";
import DocumentUpload from "../components/ui/DocumentUpload";
import { useAuth } from "../context/AuthContext";
import { projectAPI, investmentAPI } from "../services/api";
import "./Dashboard.css";

/* ─── Global Styled Components ─────────────────────────────────────── */

/* ─── Investor Editorial Layout Components ─────────────────────────── */

/* ─── Dashboard Component Implementation ─────────────────────────── */

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, adminAuthenticated, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [receivedInvestments, setReceivedInvestments] = useState([]);
  const [marketplaceProjects, setMarketplaceProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });

  const isAdmin = adminAuthenticated || user?.role === "admin";

  useEffect(() => {
    if (isAdmin) return;
    if (user?.role === "startup") {
      fetchProjects();
    } else {
      fetchInvestments();
      if (user?.role === "investor") {
        fetchMarketplaceProjects();
      }
    }
  }, [user, isAdmin]);

  if (isAdmin) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-disclaimer-container">
          <div className="dashboard-icon-wrapper">
            <ShieldAlert size={36} />
          </div>
          <h2 className="dashboard-disclaimer-title">Access Intercepted</h2>
          <p className="dashboard-disclaimer-text">
            Standard member spaces (such as investment dashboards and campaign
            builders) are reserved for startup and investor roles. You are
            logged in with admin privileges.
          </p>
          <Flex className="dashboard-intercept-actions">
            <button
              $primary
              className="dashboard-intercept-btn"
              onClick={() => navigate("/admin/dashboard")}
            >
              Go to Admin Portal
            </button>
            <button
              className="dashboard-intercept-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sign Out
            </button>
          </Flex>
        </div>
      </div>
    );
  }

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getUserProjects();
      setProjects(response.data);
      const total = response.data.length;
      const active = response.data.filter(
        (p) => p.status === "approved" || p.status === "active",
      ).length;
      const pending = response.data.filter(
        (p) => p.status === "pending",
      ).length;
      setStats({ total, active, pending });

      const receivedRes = await investmentAPI.getReceivedInvestments();
      setReceivedInvestments(receivedRes.data.investments || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await investmentAPI.getUserInvestments();
      const invs = Array.isArray(response.data.investments)
        ? response.data.investments
        : [];
      setInvestments(invs);

      const total = invs.length;
      const totalAmt = invs.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      setStats({ total, active: totalAmt, pending: 0 });
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  const fetchMarketplaceProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      // Filter out approved / active campaigns that the user hasn't backed yet
      const approved = response.data.filter(
        (p) => p.status === "approved" || p.status === "active",
      );
      setMarketplaceProjects(approved.slice(0, 3));
    } catch (error) {
      console.error("Error fetching marketplace projects:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await projectAPI.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  /* ─── Render Sub-Components ────────────────────────────────────────── */

  const renderStats = () => {
    if (user?.role === "startup") {
      return (
        <div className="dashboard-stats-grid">
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="icon-box">
              <TrendingUp size={20} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Campaigns</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="icon-box icon-box-success">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-info">
              <h3>{stats.active}</h3>
              <p>Active Campaigns</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="icon-box icon-box-warning">
              <Clock size={20} />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Moderation</p>
            </div>
          </motion.div>
        </div>
      );
    } else if (user?.role === "mnc") {
      return (
        <div className="dashboard-stats-grid">
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="icon-box">
              <Building2 size={20} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Enterprise Partnerships</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="icon-box icon-box-success">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-info">
              <h3>₹{stats.active.toLocaleString("en-IN")}</h3>
              <p>Strategic Capital Deployed</p>
            </div>
          </motion.div>
        </div>
      );
    } else if (user?.role === "employee") {
      return (
        <div className="dashboard-stats-grid">
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="icon-box">
              <Users size={20} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Co-Investments Joined</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="icon-box icon-box-success">
              <Target size={20} />
            </div>
            <div className="stat-info">
              <h3>₹{stats.active.toLocaleString("en-IN")}</h3>
              <p>Fractional Capital Deployed</p>
            </div>
          </motion.div>
        </div>
      );
    } else {
      // Investor (Fallback stats grid - used inside tabs)
      return (
        <div className="dashboard-stats-grid">
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="icon-box">
              <TrendingUp size={20} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Campaigns Backed</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="icon-box icon-box-success">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-info">
              <h3>₹{stats.active.toLocaleString("en-IN")}</h3>
              <p>Total Capital Invested</p>
            </div>
          </motion.div>
        </div>
      );
    }
  };

  const renderTableData = () => {
    if (user?.role === "startup") {
      return (
        <motion.div
          className="dashboard-content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Flex className="dashboard-section-header">
            <h2 className="card-title">Recent Campaigns</h2>
            <button
              className="dashboard-premium-btn secondary"
              onClick={() => setActiveTab("campaigns")}
            >
              View All
            </button>
          </Flex>
          <div className="dashboard-table-wrapper">
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
                {projects.slice(0, 5).map((project) => (
                  <tr key={project._id}>
                    <td className="td-bold">{project.title}</td>
                    <td className="td-muted">{project.category}</td>
                    <td className="td-amount">
                      ₹{project.targetAmount?.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={`dashboard-status-badge status-${project.status === "active" || project.status === "approved" || project.status === "completed" ? "active" : project.status === "pending" ? "pending" : project.status === "rejected" ? "rejected" : "default"}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <button
                          onClick={() => navigate(`/projects/${project._id}`)}
                          title="View Details"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/projects/${project._id}/edit`)
                          }
                          title="Edit Campaign"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          $variant="danger"
                          onClick={() => handleDelete(project._id)}
                          title="Delete Campaign"
                        >
                          <Trash2 size={14} />
                        </button>
                      </Flex>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No campaigns found. Start by creating one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      );
    } else {
      // Investor, MNC, Employee tables
      let title = "Recent Backings";
      let emptyMsg =
        "You have not backed any campaigns yet. Explore the marketplace!";
      if (user?.role === "mnc") {
        title = "Strategic Partnerships";
        emptyMsg =
          "No strategic partnerships yet. Discover enterprise opportunities!";
      } else if (user?.role === "employee") {
        title = "Internal Co-Investments";
        emptyMsg = "You haven't participated in any internal rounds yet.";
      }

      const activeTabTarget =
        user?.role === "mnc"
          ? "partnerships"
          : user?.role === "employee"
            ? "fractional"
            : "investments";

      return (
        <motion.div
          className="dashboard-content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Flex className="dashboard-section-header">
            <h2 className="card-title">{title}</h2>
            {user?.role !== "investor" && (
              <button
                className="dashboard-premium-btn secondary"
                onClick={() => setActiveTab(activeTabTarget)}
              >
                View All
              </button>
            )}
          </Flex>
          <div className="dashboard-table-wrapper">
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
                {investments.slice(0, 5).map((inv) => (
                  <tr key={inv._id}>
                    <td className="td-bold">{inv.project?.title || "—"}</td>
                    <td className="td-amount-green">
                      ₹{inv.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="td-date">
                      {new Date(
                        inv.completedAt || inv.createdAt,
                      ).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={`dashboard-status-badge status-${inv.status === "active" || inv.status === "approved" || inv.status === "completed" ? "active" : inv.status === "pending" ? "pending" : inv.status === "rejected" ? "rejected" : "default"}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/projects/${inv.project?.id || inv.project?._id}`,
                          )
                        }
                        title="View Project Details"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {investments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      {emptyMsg}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "campaigns":
      case "investments":
      case "partnerships":
      case "fractional":
        return renderTableData();
      case "backers":
        return (
          <motion.div
            className="dashboard-content-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Flex className="dashboard-section-header">
              <h2 className="card-title">Donors & Backers</h2>
            </Flex>
            <div className="dashboard-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>DONOR NAME</th>
                    <th>ROLE</th>
                    <th>AMOUNT</th>
                    <th>PROJECT BACKED</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedInvestments.map((inv) => (
                    <tr key={inv._id}>
                      <td className="td-bold">
                        {inv.investor?.name || "Anonymous"}
                      </td>
                      <td className="td-muted text-capitalize">
                        {inv.investor?.role || "—"}
                      </td>
                      <td className="td-amount-green">
                        ₹{inv.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="td-semi-bold">
                        {inv.project?.title || "—"}
                      </td>
                      <td className="td-date">
                        {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {receivedInvestments.length === 0 && (
                    <tr>
                      <td colSpan="5" className="table-cell-empty-bold-dash">
                        No donations received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            className="dashboard-content-card settings-card-pad"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Settings size={56} className="settings-icon-fade" />
            <h3 className="settings-heading">Account Configuration</h3>
            <p className="settings-text-muted">
              Settings and credentials are configured directly in the Profile
              section.
            </p>
            <button
              $primary
              className="btn-mt-large"
              onClick={() => navigate("/profile")}
            >
              Go to Profile
            </button>
          </motion.div>
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

  /* ─── Specialized Portals ────────────────────────────────────────── */

  const renderInvestorOverview = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-investor-overview"
      >
        {/* Total Wealth Asset Card */}
        <div className="dashboard-asset-card">
          <p className="label">Total Wealth Deployed</p>
          <h2 className="amount">₹{stats.active.toLocaleString("en-IN")}</h2>
          <div className="dashboard-asset-detail-grid">
            <div className="dashboard-asset-detail-item">
              <h4>Backed Campaigns</h4>
              <p>{stats.total}</p>
            </div>
            <div className="dashboard-asset-detail-item">
              <h4>Average Ticket</h4>
              <p>
                ₹
                {stats.total > 0
                  ? Math.round(stats.active / stats.total).toLocaleString(
                      "en-IN",
                    )
                  : "0"}
              </p>
            </div>
            <div className="dashboard-asset-detail-item">
              <h4>Verification Status</h4>
              <p className="verified-badge">VERIFIED</p>
            </div>
          </div>
        </div>

        {/* Live Marketplace Feed */}
        <div>
          <Flex
            justify="space-between"
            align="center"
            className="discovery-section-spacing"
          >
            <h3 className="discovery-heading">Venture Discovery Feed</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/campaigns")}
              className="btn-outline-subtle"
            >
              Browse All <ArrowRight size={14} className="icon-ml" />
            </Button>
          </Flex>

          <div className="dashboard-project-card-grid">
            {marketplaceProjects.map((p) => {
              const pProgress = Math.min(
                100,
                (p.currentAmount / p.targetAmount) * 100,
              );
              return (
                <motion.div
                  className="dashboard-mini-project-card"
                  key={p._id}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  whileHover={{ y: -4 }}
                >
                  <div>
                    <span className="category">{p.category}</span>
                    <h4>{p.title}</h4>
                  </div>
                  <p className="desc">{p.description}</p>
                  <div>
                    <Flex
                      justify="space-between"
                      className="discovery-progress-info"
                    >
                      <span>
                        ₹{p.currentAmount?.toLocaleString("en-IN")} raised
                      </span>
                      <span>{pProgress.toFixed(0)}%</span>
                    </Flex>
                    <div className="dashboard-progress-bar">
                      <div
                        className="dashboard-progress-fill"
                        style={{ width: `${Math.min(100, pProgress)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {marketplaceProjects.length === 0 && (
              <p className="no-marketplace-text">
                No active marketplace campaigns found.
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions List */}
        {renderTableData()}
      </motion.div>
    );
  };

  const renderInvestorContent = () => {
    switch (activeTab) {
      case "portfolio":
        return renderTableData();
      case "settings":
        return renderContent(); // reuse settings configuration card
      default:
        return renderInvestorOverview();
    }
  };

  // --- RETURN PORTALS BY ROLE ---

  if (user?.role === "investor") {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-investor-layout">
          {/* Custom Single-Column Header */}
          <header className="investor-header">
            <div>
              <h1 className="dashboard-welcome-heading">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="dashboard-welcome-sub">
                Monitor your startup investment portfolio and allocation.
              </p>
            </div>
            <button
              className="dashboard-premium-btn primary"
              onClick={() => navigate("/campaigns")}
            >
              Explore Marketplace
            </button>
          </header>

          {/* Segmented top tab nav bar */}
          <div className="dashboard-segmented-control">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={activeTab === "portfolio" ? "active" : ""}
              onClick={() => setActiveTab("portfolio")}
            >
              My Portfolio
            </button>
            <button
              className={activeTab === "settings" ? "active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          <AnimatePresence mode="wait">
            {renderInvestorContent()}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Fallback layout for Startups, MNCs, and Employees (Left Sidebar workspace layout)
  const renderSidebarNav = () => {
    const common = [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
    ];
    const ending = [{ id: "settings", label: "Settings", icon: Settings }];

    if (user?.role === "startup") {
      return [
        ...common,
        { id: "campaigns", label: "My Campaigns", icon: Briefcase },
        { id: "backers", label: "Donors & Backers", icon: Users },
        ...ending,
      ];
    } else if (user?.role === "mnc") {
      return [
        ...common,
        { id: "partnerships", label: "Strategic Backing", icon: Building2 },
        ...ending,
      ];
    } else if (user?.role === "employee") {
      return [
        ...common,
        { id: "fractional", label: "Internal Matchings", icon: Users },
        ...ending,
      ];
    }
    return [...common, ...ending];
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-header">
            <h2 className="dashboard-sidebar-title">Workspaces</h2>
          </div>
          {renderSidebarNav().map((nav) => (
            <div
              key={nav.id}
              className={`dashboard-sidebar-nav-item ${activeTab === nav.id ? "active" : ""}`}
              onClick={() => setActiveTab(nav.id)}
            >
              <nav.icon
                size={18}
                strokeWidth={activeTab === nav.id ? 2.5 : 2}
              />{" "}
              {nav.label}
            </div>
          ))}
        </aside>

        <main className="dashboard-main-content">
          <header className="dashboard-header">
            <div>
              <h1 className="dashboard-welcome-heading-main">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="dashboard-welcome-sub">
                {user?.role === "startup"
                  ? "Manage and track funding statuses of your campaigns."
                  : user?.role === "mnc"
                    ? "Monitor and sponsor corporate partnerships."
                    : "Track matching fractional contributions."}
              </p>
            </div>
            {user?.role === "startup" && (
              <button
                className="dashboard-premium-btn primary"
                onClick={() => navigate("/projects/new")}
              >
                <Plus size={18} className="icon-mr" /> Create Campaign
              </button>
            )}
          </header>

          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
