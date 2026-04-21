import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card, Container, Flex } from "../../components/ui";
import useAuthStore from "../../store/authStore";

const AdminLoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a; /* Dark slate for professional admin feel */
  padding: 2rem;
`;

const AdminLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: white;
  justify-content: center;
`;

const AdminCard = styled(Card)`
  background: #1e293b;
  border-color: #334155;
  width: 100%;
  max-width: 450px;
  padding: 3rem;
  color: white;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -1px;
`;

const FormSubtitle = styled.p`
  color: #94a3b8;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
`;

const DarkInput = styled(Input)`
  background: #0f172a;
  border-color: #334155;
  color: white;
  padding-left: 3rem;

  &:focus {
    background: #0f172a;
    border-color: #38bdf8;
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
  }
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
  const { adminLogin } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking admin login for now as per previous logic
      const success = await adminLogin(formData.email, formData.password);
      if (success) {
        toast.success("Admin authenticated successfully");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
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
          <ShieldCheck size={32} style={{ color: "#38bdf8" }} />
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-1.5px",
            }}
          >
            Terminal Admin
          </h1>
        </AdminLogo>

        <AdminCard>
          <FormTitle>Executive Login</FormTitle>
          <FormSubtitle>
            Access the StartupFund oversight terminal.
          </FormSubtitle>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Secure ID (Email)</Label>
              <FormIcon>
                <Mail size={18} />
              </FormIcon>
              <DarkInput
                type="email"
                placeholder="admin@startupfund.saas"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Passphrase</Label>
              <FormIcon>
                <Lock size={18} />
              </FormIcon>
              <DarkInput
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </FormGroup>

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "1rem",
                background: "#38bdf8",
                color: "#0f172a",
              }}
            >
              <LogIn size={18} style={{ marginRight: 8 }} />
              {loading ? "Authenticating..." : "Enter Oversight Module"}
            </Button>
          </form>

          <Button
            variant="outline"
            style={{
              width: "100%",
              marginTop: "1.5rem",
              borderColor: "#334155",
              color: "#94a3b8",
            }}
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} style={{ marginRight: 8 }} /> Return to Main
            Ecosystem
          </Button>
        </AdminCard>
      </motion.div>
    </AdminLoginWrapper>
  );
};

export default AdminLogin;
