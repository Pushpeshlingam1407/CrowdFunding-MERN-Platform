import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Input } from "../../components/ui";
import useAuthStore from "../../store/authStore";
import "./AdminLogin.css";





const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, error, errorField, isAuthenticated, user, logout } =
    useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await adminLogin(formData.email, formData.password);
      if (success) {
        toast.success("Admin authenticated successfully");
        navigate("/admin/dashboard");
      } else {
        const currentError = useAuthStore.getState().error;
        toast.error(
          currentError || "Access denied. Admin privileges required.",
        );
      }
    } catch (err) {
      toast.error("Authentication Error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndContinue = () => {
    logout();
  };

  if (isAuthenticated && user?.role !== "admin") {
    return (
      <div className="admin-login-wrapper">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="admin-login-motion-wrapper"
        >
          <div className="admin-logo">
            <ShieldCheck size={32} className="admin-icon-color" />
            <h1 className="admin-portal-title">Admin Portal</h1>
          </div>

          <div className="admin-styled-card admin-card-center">
            <AlertCircle size={48} className="admin-alert-icon" />
            <h2 className="admin-form-title admin-form-title-lg">
              Session Conflict
            </h2>
            <p className="admin-form-subtitle admin-subtitle-mb">
              You are currently signed in as standard member{" "}
              <strong>{user?.name}</strong> ({user?.role}). The Admin Portal
              requires administrative credentials.
            </p>

            <Button
              onClick={() => navigate("/dashboard")}
              className="admin-btn-dark btn-mb-1"
            >
              Go to Member Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={handleLogoutAndContinue}
              className="admin-btn-outline"
            >
              Logout & Sign In as Admin
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="admin-login-motion-wrapper"
      >
        <div className="admin-logo">
          <ShieldCheck size={32} className="admin-icon-color" />
          <h1 className="admin-portal-title">Admin Portal</h1>
        </div>

        <div className="admin-styled-card">
          <h2 className="admin-form-title">Admin Sign In</h2>
          <p className="admin-form-subtitle">
            Sign in to access the administrator dashboard.
          </p>

          {error && !errorField && (
            <div className="admin-error-box">
              <AlertCircle size={18} className="icon-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Email Address</label>
              <Input className={`admin-light-input ${errorField === "email" ? "error" : ""}`}
                type="email"
                placeholder="admin@crowdfunding.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {errorField === "email" && (
                <div className="admin-field-error">
                  <AlertCircle size={13} />
                  {error}
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <Input className={`admin-light-input ${errorField === "password" ? "error" : ""}`}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              {errorField === "password" && (
                <div className="admin-field-error">
                  <AlertCircle size={13} />
                  {error}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="admin-btn-dark btn-mt-1"
            >
              <LogIn size={18} className="icon-mr" />
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <Button
            variant="outline"
            className="admin-btn-outline btn-mt-1-5"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} className="icon-mr" /> Return to Website
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
