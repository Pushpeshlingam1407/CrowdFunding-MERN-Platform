import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  ShieldAlert,
  ShieldCheck,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Calendar,
} from "lucide-react";

const AdminLayout = ({
  children,
  title = "Dashboard",
  subtitle = "Overview",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("adminTheme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const menu = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart2 },
    { name: "Financials", path: "/admin/financials", icon: FileText },
    { name: "Customers", path: "/admin/users", icon: Users },
    { name: "Campaigns", path: "/admin/projects", icon: ShieldCheck },
    { name: "Complaints", path: "/admin/complaints", icon: ShieldAlert },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className={`admin-layout-wrapper ${theme}`}>
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <Logo size={28} theme={theme} />
            <span className="admin-brand-name" style={{ marginLeft: "4px" }}>
              StartupFund
            </span>
          </div>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Main Menu</div>
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${active ? "active" : ""}`}
                title={collapsed ? item.name : ""}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-user-profile">
            <div className="admin-user-avatar">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">
                {adminUser?.name || "Admin"}
              </span>
              <span className="admin-user-role">Sign Out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`admin-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        {/* TOP NAVIGATION */}
        <header className="admin-top-nav">
          <div className="admin-search">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search accounts, campaigns, or TxIDs..."
            />
          </div>

          <div className="admin-top-actions">
            <div
              className="admin-search"
              style={{ width: "auto", gap: "0.5rem", cursor: "pointer" }}
            >
              <Calendar size={14} className="text-muted" />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "var(--admin-text-secondary)",
                }}
              >
                Last 30 Days
              </span>
            </div>

            <button
              className="admin-icon-btn"
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button className="admin-icon-btn" title="Notifications">
              <Bell size={18} />
              <div className="admin-live-badge" />
            </button>
          </div>
        </header>

        {/* VIEW CONTAINER */}
        <div className="admin-view-container">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
