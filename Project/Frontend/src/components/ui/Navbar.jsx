import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Flex } from "./index";
import useAuthStore from "../../store/authStore";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout, user, adminAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = adminAuthenticated || user?.role === "admin";

  return (
    <nav className="nav-container">
      <Container>
        <Flex justify="space-between">
          <Flex gap="3rem">
            <Link to="/" className="nav-logo">
              Startup<span>Fund</span>
            </Link>
            <Flex gap="2rem">
              <Link to="/campaigns" className="nav-link">
                Marketplace
              </Link>
              {isAuthenticated && !isAdmin && (
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/dashboard" className="nav-link nav-admin-link">
                  Admin Portal
                </Link>
              )}
            </Flex>
          </Flex>

          <Flex gap="1.5rem">
            {!isAuthenticated && !adminAuthenticated ? (
              <Flex gap="1.5rem">
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
                <Button
                  onClick={() => navigate("/register")}
                  className="nav-get-started-btn"
                >
                  Get Started
                </Button>
              </Flex>
            ) : (
              <Flex gap="1.5rem">
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/profile"}
                  className="nav-link nav-profile-link"
                >
                  <div
                    className={`nav-avatar ${isAdmin ? "nav-avatar--admin" : "nav-avatar--user"}`}
                  >
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  {user?.name?.split(" ")[0] || "Admin"}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

export default Navbar;
