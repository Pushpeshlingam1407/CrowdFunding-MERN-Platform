import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Input, Card, Container, Flex } from "../../components/ui";
import useAuthStore from "../../store/authStore";

const AdminLoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbf9f6;
  background-image: radial-gradient(#d3d0c9 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 2rem;
  font-family: inherit;
`;

const AdminLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: #191919;
  justify-content: center;
`;

const StyledCard = styled.div`
  background: #ffffff;
  border: 1px solid #e3e0d8;
  border-radius: 24px;
  padding: 3.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.015);
  width: 100%;
  max-width: 450px;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -0.03em;
  font-family: ${(props) => props.theme.fonts.serif};
  color: #191919;
`;

const FormSubtitle = styled.p`
  color: #86868b;
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
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6e6e73;
  margin-bottom: 0.5rem;
`;

const LightInput = styled(Input)`
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  border: 1px solid #dcdad2;
  font-size: 0.95rem;
  height: 3rem;
  background: #ffffff;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border-color: ${({ $hasError }) => ($hasError ? "#ef4444" : undefined)};
  width: 100%;

  &:focus {
    background: #ffffff;
    border-color: ${({ $hasError }) => ($hasError ? "#ef4444" : "#191919")};
    box-shadow: ${({ $hasError }) =>
      $hasError
        ? "0 0 0 4px rgba(239, 68, 68, 0.15)"
        : "0 0 0 4px rgba(25, 25, 25, 0.05)"};
  }
`;

const FieldError = styled.div`
  color: #ef4444;
  font-size: 0.82rem;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
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
                $hasError={errorField === "email"}
                required
              />
              {errorField === "email" && (
                <FieldError>
                  <AlertCircle size={13} />
                  {error}
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
                $hasError={errorField === "password"}
                required
              />
              {errorField === "password" && (
                <FieldError>
                  <AlertCircle size={13} />
                  {error}
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
