import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Flag,
  ArrowLeft,
  Clock,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button, Card, Container, Flex, Grid, Input } from "../../components/ui";

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
    vertical-align: top;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover td {
    background: #fafafa;
  }
`;

const TypeBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${(props) =>
    props.type === "fraud"
      ? "background:#fff5f5;color:#c53030;"
      : props.type === "unpaid"
      ? "background:#fffbeb;color:#92400e;"
      : props.type === "bug"
      ? "background:#ebf8ff;color:#2b6cb0;"
      : "background:#f0fff4;color:#276749;"}
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  ${(props) =>
    props.status === "resolved"
      ? "background:#f0fff4;color:#276749;"
      : props.status === "in-progress"
      ? "background:#ebf8ff;color:#2b6cb0;"
      : "background:#fff5f5;color:#c53030;"}
`;

const AdminComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setComplaints(data.complaints || []);
      } else {
        toast.error("Failed to load compliance reports");
      }
    } catch (error) {
      toast.error("Failed to load compliance reports");
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/complaints/${id}/resolve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Complaint marked as resolved");
        fetchComplaints();
      } else {
        toast.error("Failed to resolve complaint");
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const filtered = complaints.filter((c) =>
    `${c.subject} ${c.author?.name} ${c.targetCompany?.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pending   = complaints.filter((c) => c.status === "pending").length;
  const resolved  = complaints.filter((c) => c.status === "resolved").length;

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
          <Flex justify="space-between" align="flex-start">
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "0.5rem" }}>
                Compliance Audit
              </h1>
              <p style={{ color: "#666" }}>
                Review reported bugs, fraud allegations, and B2B SaaS ecosystem irregularities.
              </p>
            </div>
          </Flex>
        </header>

        {/* Stats + Search */}
        <Card style={{ padding: "2rem", marginBottom: "0" }}>
          <Flex justify="space-between" align="center" gap="1rem" style={{ flexWrap: "wrap" }}>
            <Flex gap="2rem">
              <Flex gap="0.75rem" style={{ color: "#c53030", fontWeight: 800 }}>
                <ShieldAlert size={20} />
                {pending} PENDING
              </Flex>
              <div style={{ height: "24px", width: "2px", background: "#eee" }} />
              <Flex gap="0.75rem" style={{ color: "#276749", fontWeight: 700 }}>
                <CheckCircle2 size={20} />
                {resolved} RESOLVED
              </Flex>
              <div style={{ height: "24px", width: "2px", background: "#eee" }} />
              <Flex gap="0.75rem" style={{ color: "#666", fontWeight: 700 }}>
                <Flag size={20} />
                {complaints.length} TOTAL
              </Flex>
            </Flex>
            <div style={{ position: "relative", width: "300px" }}>
              <Search
                size={18}
                style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#999" }}
              />
              <Input
                style={{ paddingLeft: "3rem" }}
                placeholder="Search subject or entity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Flex>
        </Card>

        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>Issue Summary</th>
                <th>Type</th>
                <th>Reporter</th>
                <th>Target Campaign / Entity</th>
                <th>Status</th>
                <th>Reported</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "4rem", color: "#999" }}>
                    Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "4rem", color: "#999" }}>
                    {search ? "No reports match your search." : "Ecosystem secured. No active compliance reports."}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    {/* Subject */}
                    <td style={{ maxWidth: "280px" }}>
                      <h4 style={{ fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.95rem" }}>
                        {item.subject}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.description}
                      </p>
                    </td>

                    {/* Type */}
                    <td>
                      <TypeBadge type={item.type}>{item.type}</TypeBadge>
                    </td>

                    {/* Reporter */}
                    <td>
                      <Flex gap="0.5rem" align="center">
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: "#0077b615", color: "#0077b6",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: "0.85rem", flexShrink: 0
                        }}>
                          {item.author?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.author?.name || "Unknown"}</p>
                          <p style={{ fontSize: "0.75rem", color: "#888" }}>{item.author?.email}</p>
                        </div>
                      </Flex>
                    </td>

                    {/* Target */}
                    <td>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0077b6" }}>
                        {item.targetCompany?.name || "N/A"}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#888" }}>{item.targetCompany?.email}</p>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={item.status}>{item.status}</StatusBadge>
                    </td>

                    {/* Date */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Flex gap="0.4rem" align="center" style={{ color: "#888", fontSize: "0.8rem" }}>
                        <Clock size={14} />
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </Flex>
                    </td>

                    {/* Action */}
                    <td>
                      <Flex gap="0.5rem">
                        {item.status !== "resolved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveComplaint(item._id)}
                          >
                            <CheckCircle2 size={14} style={{ marginRight: 6 }} />
                            Resolve
                          </Button>
                        )}
                        {item.status === "resolved" && (
                          <span style={{ color: "#276749", fontWeight: 700, fontSize: "0.85rem" }}>✓ Done</span>
                        )}
                      </Flex>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
};

export default AdminComplaints;
