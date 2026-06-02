import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Input, Card, Container, Flex } from "../../components/ui";
import useAuthStore from "../../store/authStore";

const AdminLoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const AdminLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: #0f172a;
  justify-content: center;
`;

const AdminCard = styled(Card)`
  background: #ffffff;
  border-color: #e2e8f0;
  width: 100%;
  max-width: 450px;
  padding: 3rem;
  color: #0f172a;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -1px;
`;

const FormSubtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
`;

const LightInput = styled(Input)`
  background: #ffffff;
  border-color: ${({ $hasError }) => $hasError ? '#ef4444' : '#cbd5e1'};
  color: #0f172a;
  padding-left: 3rem;
  border-radius: 8px;

  &:focus {
    background: #ffffff;
    border-color: ${({ $hasError }) => $hasError ? '#ef4444' : '#2563eb'};
    box-shadow: ${({ $hasError }) => $hasError
      ? '0 0 0 4px rgba(239, 68, 68, 0.15)'
      : '0 0 0 4px rgba(37, 99, 235, 0.1)'};
  }
`;

const FieldError = styled.div`
  color: #f87171;
  font-size: 0.82rem;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
`;

const FormIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 2.35rem;
  color: #64748b;
  z-index: 1;
`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, error, errorField } = useAuthStore();
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
      }
      // errors are shown inline via errorField — no generic toast needed
    } catch (err) {
      toast.error("Authentication Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLoginWrapper>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <AdminLogo>
          <ShieldCheck size={32} style={{ color: "#2563eb" }} />
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            Admin Portal
          </h1>
        </AdminLogo>

        <AdminCard>
          <FormTitle>Admin Sign In</FormTitle>
          <FormSubtitle>
            Sign in to access the administrator dashboard.
          </FormSubtitle>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email Address</Label>
              <FormIcon>
                <Mail size={18} />
              </FormIcon>
              <LightInput
                type="email"
                placeholder="admin@crowdfunding.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                $hasError={errorField === 'email'}
                required
              />
              {errorField === 'email' && (
                <FieldError>
                  <AlertCircle size={13} />{error}
                </FieldError>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <FormIcon>
                <Lock size={18} />
              </FormIcon>
              <LightInput
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                $hasError={errorField === 'password'}
                required
              />
              {errorField === 'password' && (
                <FieldError>
                  <AlertCircle size={13} />{error}
                </FieldError>
              )}
            </FormGroup>

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "1rem",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              <LogIn size={18} style={{ marginRight: 8 }} />
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <Button
            variant="outline"
            style={{
              width: "100%",
              marginTop: "1.5rem",
              borderColor: "#cbd5e1",
              color: "#64748b",
              background: "transparent",
              padding: "0.75rem",
              borderRadius: "8px",
              fontWeight: 600,
            }}
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} style={{ marginRight: 8 }} /> Return to Website
          </Button>
        </AdminCard>
      </motion.div>
    </AdminLoginWrapper>
  );
};

export default AdminLogin;
