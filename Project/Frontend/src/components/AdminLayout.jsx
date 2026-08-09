import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = ({
  children,
  title = "Dashboard",
  subtitle = "Overview",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuthStore();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", path: "/admin/projects", icon: FileText },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart2 },
    { name: "Complaints", path: "/admin/complaints", icon: ShieldAlert },
    {
      name: "Verification",
      path: "/admin/document-verification",
      icon: ShieldCheck,
    },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo-area">
          <div className="admin-logo-icon">A</div>
          <h2>Admin Portal</h2>
        </div>
        <nav className="admin-nav-list">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${active ? "active" : ""}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-bottom">
          <button
            onClick={handleLogout}
            className="admin-nav-item admin-logout-btn"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <header className="admin-top-header">
          <div className="admin-header-greeting">
            <p>Pages / {title}</p>
            <h1>{title}</h1>
          </div>
          <div className="admin-header-actions">
            <div className="admin-search-box">
              <Search size={16} color="#86868b" />
              <input type="text" placeholder="Search..." />
            </div>
            <button className="admin-action-btn">
              <Bell size={20} />
            </button>
            <div className="admin-avatar">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="admin-action-btn admin-logout-icon"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="admin-page-container">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
