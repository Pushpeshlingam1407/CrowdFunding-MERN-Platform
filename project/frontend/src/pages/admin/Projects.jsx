import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Trash2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button, Card, Container, Flex, Input } from "../../components/ui";

const AdminWrapper = styled.div`
  min-height: 100vh;
  background: #0f172a;
  padding: 3rem 0;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const Heading = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: #f8fafc;
  margin-bottom: 0.5rem;
`;

const SubHeading = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`;

const TableWrapper = styled.div`
  background: #1e293b;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #334155;
  margin-top: 1.5rem;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 1rem 1.5rem;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #64748b;
    background: #0f172a;
    border-bottom: 1px solid #334155;
  }

  td {
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid #1e293b;
    font-size: 0.9rem;
    color: #cbd5e1;
    vertical-align: middle;
  }

  tbody tr {
    background: #1e293b;
    transition: background 0.15s;
  }

  tbody tr:hover {
    background: #263349;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  ${(props) =>
    props.$status === "approved"
      ? `
    background: rgba(34,197,94,0.12);
    color: #4ade80;
    border: 1px solid rgba(34,197,94,0.25);
  `
      : props.$status === "pending"
        ? `
    background: rgba(251,191,36,0.12);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.25);
  `
        : `
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.25);
  `}
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 10px;
    color: #f8fafc;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder {
      color: #475569;
    }
    &:focus {
      border-color: #38bdf8;
    }
  }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
  background: transparent;

  ${(props) =>
    props.$variant === "approve"
      ? `
    color: #4ade80;
    border-color: rgba(34,197,94,0.35);
    &:hover { background: rgba(34,197,94,0.1); }
  `
      : props.$variant === "reject"
        ? `
    color: #f87171;
    border-color: rgba(239,68,68,0.35);
    &:hover { background: rgba(239,68,68,0.1); }
  `
        : props.$variant === "delete"
          ? `
    color: #f87171;
    border-color: rgba(239,68,68,0.25);
    &:hover { background: rgba(239,68,68,0.1); }
  `
          : `
    color: #94a3b8;
    border-color: #334155;
    &:hover { background: #263349; }
  `}
`;

const EmptyState = styled.div`
  padding: 5rem 2rem;
  text-align: center;
  color: #475569;

  svg {
    margin: 0 auto 1rem;
    display: block;
    opacity: 0.4;
  }
  p {
    font-size: 0.95rem;
  }
`;

const BASE = "http://localhost:5000";

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const fetchAdminProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      // API returns { success, projects }
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  // Correct endpoint: PUT /api/admin/projects/:id with { status } body
  const handleStatusChange = async (projectId, status) => {
    try {
      const res = await fetch(`${BASE}/api/admin/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");
      toast.success(
        `Campaign ${status === "approved" ? "approved ✓" : "rejected ✗"}`,
      );
      fetchAdminProjects();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Permanently delete this campaign?")) return;
    try {
      const res = await fetch(`${BASE}/api/admin/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Campaign deleted");
      fetchAdminProjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <AdminWrapper>
      <Container>
        <PageHeader>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "none",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#94a3b8",
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ArrowLeft size={15} /> Back to Overview
          </button>
          <Heading>Campaign Moderation</Heading>
          <SubHeading>
            Verify and approve startup ventures across the platform.
          </SubHeading>
        </PageHeader>

        {/* Search + Refresh bar */}
        <Flex gap="1rem" style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <SearchBar>
            <Search size={16} />
            <input
              placeholder="Search by title or creator…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <ActionBtn
            onClick={fetchAdminProjects}
            style={{ whiteSpace: "nowrap" }}
          >
            <RefreshCw size={14} /> Refresh
          </ActionBtn>
        </Flex>

        {/* Status filters */}
        <Flex gap="0.6rem" style={{ marginBottom: "1.5rem" }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 99,
                border: "1px solid",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
                background: filter === tab.key ? "#38bdf8" : "transparent",
                borderColor: filter === tab.key ? "#38bdf8" : "#334155",
                color: filter === tab.key ? "#0f172a" : "#64748b",
              }}
            >
              {tab.label}
            </button>
          ))}
        </Flex>

        <TableWrapper>
          {loading ? (
            <EmptyState>
              <RefreshCw size={32} className="spin" />
              <p>Loading campaigns…</p>
            </EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState>
              <Briefcase size={36} />
              <p>No campaigns match your filters.</p>
            </EmptyState>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Creator</th>
                  <th>Target</th>
                  <th>Equity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, i) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td style={{ maxWidth: 260 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#f8fafc",
                          marginBottom: 2,
                        }}
                      >
                        {project.title}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#475569" }}>
                        {project.category} ·{" "}
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: "#e2e8f0" }}>
                        {project.creator?.name || "—"}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#475569" }}>
                        {project.creator?.email}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontWeight: 700, color: "#38bdf8" }}>
                        ₹{Number(project.targetAmount).toLocaleString("en-IN")}
                      </p>
                    </td>
                    <td>
                      <p style={{ color: "#94a3b8" }}>{project.equity}%</p>
                    </td>
                    <td>
                      <StatusBadge $status={project.status}>
                        {project.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        {project.status === "pending" && (
                          <>
                            <ActionBtn
                              $variant="approve"
                              onClick={() =>
                                handleStatusChange(project._id, "approved")
                              }
                            >
                              <CheckCircle2 size={13} /> Approve
                            </ActionBtn>
                            <ActionBtn
                              $variant="reject"
                              onClick={() =>
                                handleStatusChange(project._id, "rejected")
                              }
                            >
                              <XCircle size={13} /> Reject
                            </ActionBtn>
                          </>
                        )}
                        {project.status === "approved" && (
                          <ActionBtn
                            $variant="reject"
                            onClick={() =>
                              handleStatusChange(project._id, "rejected")
                            }
                          >
                            <XCircle size={13} /> Revoke
                          </ActionBtn>
                        )}
                        {project.status === "rejected" && (
                          <ActionBtn
                            $variant="approve"
                            onClick={() =>
                              handleStatusChange(project._id, "approved")
                            }
                          >
                            <CheckCircle2 size={13} /> Re-approve
                          </ActionBtn>
                        )}
                        <ActionBtn
                          onClick={() => navigate(`/projects/${project._id}`)}
                        >
                          <ExternalLink size={13} />
                        </ActionBtn>
                        <ActionBtn
                          $variant="delete"
                          onClick={() => handleDelete(project._id)}
                        >
                          <Trash2 size={13} />
                        </ActionBtn>
                      </Flex>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
};

export default AdminProjects;
