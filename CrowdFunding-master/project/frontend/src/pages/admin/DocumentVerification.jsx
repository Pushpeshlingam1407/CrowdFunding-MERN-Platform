import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Lock,
  Eye,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Input,
} from "../../components/ui";

const AdminWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  margin-top: 2rem;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 1.25rem 2rem;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #999;
    border-bottom: 2px solid #fafafa;
  }

  td {
    padding: 1.25rem 2rem;
    border-bottom: 1px solid #fafafa;
    font-size: 0.95rem;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const DocBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
`;

const AdminDocumentVerification = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/api/admin/documents",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setVerifications(data);
    } catch (error) {
      toast.error("Failed to load KYC documents");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, docIndex, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(
        `http://localhost:5000/api/admin/documents/${userId}/${docIndex}/${status}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`Document ${status}`);
      fetchVerifications();
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  return (
    <AdminWrapper>
      <Container>
        <header style={{ marginBottom: "3rem" }}>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            style={{ marginBottom: "2rem" }}
          >
            <ArrowLeft size={16} style={{ marginRight: 8 }} /> Admin Terminal
          </Button>
          <Flex justify="space-between">
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  marginBottom: "0.5rem",
                }}
              >
                KYC & Verification
              </h1>
              <p style={{ color: "#666" }}>
                Audit identity proofs and professional certificates in our B2B
                SaaS ecosystem.
              </p>
            </div>
            <Flex gap="1rem">
              <Button variant="outline" style={{ display: "flex", gap: 8 }}>
                <Filter size={18} /> Filters
              </Button>
            </Flex>
          </Flex>
        </header>

        <Card style={{ padding: "2rem" }}>
          <Flex justify="space-between">
            <Flex gap="1.5rem">
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>18</h3>
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Awaiting Audit
                </p>
              </div>
              <div
                style={{ height: "40px", width: "2px", background: "#eee" }}
              />
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>1,124</h3>
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Verified Entities
                </p>
              </div>
            </Flex>
            <div style={{ position: "relative", width: "300px" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                }}
              />
              <Input
                style={{ paddingLeft: "3rem" }}
                placeholder="Search entity name..."
              />
            </div>
          </Flex>
        </Card>

        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>ENTITY / PROFESSIONAL</th>
                <th>DOCUMENT TYPE</th>
                <th>DATE UPLOADED</th>
                <th>SECURITY STATUS</th>
                <th>INSPECTION</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((verify) => (
                <tr key={verify._id}>
                  <td>
                    <Flex gap="1rem">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "8px",
                          background: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Lock size={18} style={{ color: "#999" }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                          {verify.user?.name}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#888" }}>
                          {verify.user?.email}
                        </p>
                      </div>
                    </Flex>
                  </td>
                  <td>
                    <Flex gap="0.5rem">
                      <DocBadge>IDENTITY PROOF</DocBadge>
                      <DocBadge>ADDRESS</DocBadge>
                    </Flex>
                  </td>
                  <td>
                    <Flex
                      gap="0.5rem"
                      style={{ fontSize: "0.85rem", color: "#666" }}
                    >
                      <Calendar size={14} /> Aug 12, 2026
                    </Flex>
                  </td>
                  <td>
                    <Flex
                      gap="0.5rem"
                      style={{
                        color: "#2f855a",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      <ShieldCheck size={16} /> SAFE
                    </Flex>
                  </td>
                  <td>
                    <Flex gap="0.5rem">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(verify.identityProof, "_blank")
                        }
                      >
                        <Eye size={16} style={{ marginRight: 8 }} /> Inspect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ color: "#2f855a", borderColor: "#c6f6d5" }}
                        onClick={() =>
                          handleVerify(verify.user?._id, 0, "verified")
                        }
                      >
                        <CheckCircle2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ color: "#e53e3e", borderColor: "#fed7d7" }}
                        onClick={() =>
                          handleVerify(verify.user?._id, 0, "rejected")
                        }
                      >
                        <XCircle size={16} />
                      </Button>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {verifications.length === 0 && (
            <div
              style={{ padding: "6rem", textAlign: "center", color: "#999" }}
            >
              Audit queue is empty. System secured.
            </div>
          )}
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
};

export default AdminDocumentVerification;
