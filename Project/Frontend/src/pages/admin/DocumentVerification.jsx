import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Lock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Flex } from "../../components/ui";
import AdminLayout from "../../components/AdminLayout";

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
  margin-top: 2rem;
  border: none;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #A3AED0;
    background: #ffffff;
    border-bottom: 1px solid #f1f5f9;
  }

  td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;
    color: #475569;
    vertical-align: middle;
  }

  tbody tr {
    background: #ffffff;
    transition: all 0.2s;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: #F4F7FE;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(112, 144, 176, 0.08);
  }
`;

const DocBadge = styled.span`
  padding: 0.35rem 0.8rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 800;
  background: rgba(67, 24, 255, 0.1);
  color: #4318FF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #A3AED0;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    background: #F4F7FE;
    border: none;
    border-radius: 20px;
    color: #2B3674;
    font-size: 0.9rem;
    font-weight: 500;
    outline: none;
    transition: all 0.2s;

    &::placeholder { color: #A3AED0; }
    &:focus { box-shadow: 0px 18px 40px rgba(67, 24, 255, 0.1); background: #ffffff; }
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4318FF 0%, #868CFF 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(67, 24, 255, 0.2);
`;

const AdminDocumentVerification = () => {
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
    <AdminLayout title="KYC & Verification" subtitle="Audit identity proofs and professional certificates in our ecosystem.">
      <div>
        <div style={{ background: "#ffffff", border: "none", borderRadius: 20, padding: "1.5rem", boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.12)" }}>
          <Flex justify="space-between" align="center" gap="1rem" style={{ flexWrap: "wrap" }}>
            <Flex gap="2rem">
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#E31A1A" }}>{verifications.length}</h3>
                <p
                  style={{
                    color: "#A3AED0",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Awaiting Audit
                </p>
              </div>
              <div
                style={{ height: "40px", width: "1px", background: "#f1f5f9" }}
              />
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#2B3674" }}>1,124</h3>
                <p
                  style={{
                    color: "#A3AED0",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Verified Entities
                </p>
              </div>
            </Flex>
            <div style={{ position: "relative", width: "340px" }}>
              <SearchBar>
                <Search size={16} />
                <input
                  placeholder="Search entity name..."
                />
              </SearchBar>
            </div>
            <button 
              onClick={fetchVerifications} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20,
                padding: '0.6rem 1.5rem', color: '#2B3674', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
            </button>
          </Flex>
        </div>

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
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "4rem", color: "#A3AED0", fontWeight: 600 }}>
                    Loading queue...
                  </td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "4rem", color: "#A3AED0", fontWeight: 600 }}>
                    Audit queue is empty. System secured.
                  </td>
                </tr>
              ) : (
                verifications.map((verify) => (
                  <tr key={verify._id}>
                    <td>
                      <Flex gap="1rem">
                        <Avatar>{verify.user?.name?.charAt(0) || "?"}</Avatar>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#2B3674" }}>
                            {verify.user?.name}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "#A3AED0", fontWeight: 500 }}>
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
                        style={{ fontSize: "0.85rem", color: "#2B3674", fontWeight: 700 }}
                      >
                        <Calendar size={14} style={{ color: "#A3AED0" }} /> Aug 12, 2026
                      </Flex>
                    </td>
                    <td>
                      <Flex
                        gap="0.5rem"
                        style={{
                          color: "#05CD99",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          background: "rgba(5, 205, 153, 0.1)",
                          padding: "0.3rem 0.8rem",
                          borderRadius: 99,
                          display: "inline-flex"
                        }}
                      >
                        <ShieldCheck size={16} /> SAFE
                      </Flex>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <button
                          onClick={() => window.open(verify.identityProof, "_blank")}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 8,
                            padding: "0.4rem 0.85rem", color: "#2B3674", fontSize: "0.8rem", fontWeight: 700,
                            cursor: "pointer", transition: "all 0.15s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#F4F7FE'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                        >
                          <Eye size={14} /> Inspect
                        </button>
                        <button
                          onClick={() => handleVerify(verify.user?._id, 0, "verified")}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            background: "#ffffff", border: "1px solid rgba(5,205,153,0.3)", borderRadius: 8,
                            padding: "0.4rem 0.6rem", color: "#05CD99",
                            cursor: "pointer", transition: "all 0.15s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(5,205,153,0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => handleVerify(verify.user?._id, 0, "rejected")}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            background: "#ffffff", border: "1px solid rgba(227,26,26,0.3)", borderRadius: 8,
                            padding: "0.4rem 0.6rem", color: "#E31A1A",
                            cursor: "pointer", transition: "all 0.15s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(227,26,26,0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                        >
                          <XCircle size={16} />
                        </button>
                      </Flex>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </AdminLayout>
  );
};

export default AdminDocumentVerification;
