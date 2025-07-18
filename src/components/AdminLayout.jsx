import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, BarChart2 } from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#212529",
    color: "#fff",
    minHeight: "100vh",
    padding: "1.5rem 1rem",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    left: 0
  };

  const mainStyle = {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  };

  const navItemStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 15px",
    marginBottom: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    color: location.pathname === path ? "#0d6efd" : "#ffffff",
    backgroundColor: location.pathname === path ? "#343a40" : "transparent",
    fontWeight: 500,
    transition: "background 0.2s, color 0.2s"
  });

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3 style={{ color: "#fff", marginBottom: "2rem" }}>Admin Panel</h3>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/admin/dashboard" style={navItemStyle("/admin/dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/admin/projects" style={navItemStyle("/admin/projects")}>
            <FileText size={18} />
            Projects
          </Link>
          <Link to="/admin/users" style={navItemStyle("/admin/users")}>
            <Users size={18} />
            Users
          </Link>
          <Link to="/admin/analytics" style={navItemStyle("/admin/analytics")}>
            <BarChart2 size={18} />
            Analytics
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
