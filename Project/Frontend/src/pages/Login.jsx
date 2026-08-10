import React, { useState, useEffect } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import { Button, Input, Card, Container, Flex } from "../components/ui";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    login,
    adminLogin,
    isAuthenticated,
    adminAuthenticated,
    error,
    errorField,
    isLoading,
  } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (adminAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [adminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(formData.email, formData.password);
    if (success) {
      toast.success("Welcome back! Successfully logged in.");
      navigate(from, { replace: true });
    } else {
      const errorMsg = useAuthStore.getState().error;
      if (errorMsg?.includes("Access Denied")) {
        toast.error(errorMsg);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-wrapper">
      <Container>
        <Flex justify="center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="auth-form-wrapper"
          >
            <div className="login-card">
              <h2 className="login-form-title">Welcome Back</h2>
              <p className="login-form-subtitle">Sign in to your account</p>

              {error && !errorField && (
                <div className="login-error-box">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                  <label className="login-label">Email address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`login-input ${errorField === "email" ? "has-error" : ""}`}
                    required
                  />
                  {errorField === "email" && (
                    <div className="login-field-error">
                      <AlertCircle size={13} />
                      {error}
                    </div>
                  )}
                </div>

                <div className="login-form-group">
                  <label className="login-label">Password</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`login-input ${errorField === "password" ? "has-error" : ""}`}
                    required
                  />
                  {errorField === "password" && (
                    <div className="login-field-error">
                      <AlertCircle size={13} />
                      {error}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="login-submit-btn btn-primary-dark"
                >
                  <LogIn size={18} className="icon-mr" />
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="login-link-container">
                  <span className="text-muted-sm">
                    New to StartupFund?{" "}
                    <Link to="/register" className="login-signup-link">
                      Get started
                    </Link>
                  </span>
                </div>
              </form>

              {/* Admin hint */}
              <div className="login-admin-hint">
                Admin? Use your admin credentials above or{" "}
                <Link to="/admin/login">go to the Admin Portal →</Link>
              </div>
            </div>
          </motion.div>
        </Flex>
      </Container>
    </div>
  );
};

export default Login;
