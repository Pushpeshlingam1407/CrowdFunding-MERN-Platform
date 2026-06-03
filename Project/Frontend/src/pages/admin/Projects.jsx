import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Flex } from "../../components/ui";
import AdminLayout from "../../components/AdminLayout";

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: none;
  margin-top: 1.5rem;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);

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
    color: #a3aed0;
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

  tbody tr:hover {
    background: #f4f7fe;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(112, 144, 176, 0.08);
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  padding: 0.4rem 1rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  ${(props) =>
    props.$status === "approved"
      ? `background: rgba(5, 205, 153, 0.1); color: #05CD99;`
      : props.$status === "pending"
        ? `background: rgba(255, 181, 71, 0.1); color: #FFB547;`
        : `background: rgba(227, 26, 26, 0.1); color: #E31A1A;`}
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a3aed0;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    background: #ffffff;
    border: none;
    border-radius: 20px;
    color: #2b3674;
    font-size: 0.9rem;
    font-weight: 500;
    outline: none;
    transition: all 0.2s;
    box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);

    &::placeholder {
      color: #a3aed0;
    }
    &:focus {
      box-shadow: 0px 18px 40px rgba(67, 24, 255, 0.2);
    }
  }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
  background: #ffffff;

  ${(props) =>
    props.$variant === "approve"
      ? `color: #05CD99; border-color: rgba(5,205,153,0.3); &:hover { background: rgba(5,205,153,0.1); }`
      : props.$variant === "reject"
        ? `color: #E31A1A; border-color: rgba(227,26,26,0.3); &:hover { background: rgba(227,26,26,0.1); }`
        : props.$variant === "delete"
          ? `color: #E31A1A; border-color: rgba(227,26,26,0.3); &:hover { background: rgba(227,26,26,0.1); }`
          : `color: #4318FF; border-color: rgba(67,24,255,0.3); &:hover { background: rgba(67,24,255,0.1); }`}
`;

const EmptyState = styled.div`
  padding: 5rem 2rem;
  text-align: center;
  color: #a3aed0;

  svg {
    margin: 0 auto 1rem;
    display: block;
    opacity: 0.4;
    color: #a3aed0;
  }
  p {
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");
  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const fetchAdminProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getBaseURL()}/admin/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, status) => {
    try {
      const res = await fetch(`${getBaseURL()}/admin/projects/${projectId}`, {
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
      const res = await fetch(`${getBaseURL()}/admin/projects/${projectId}`, {
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
    <AdminLayout title="Campaigns" subtitle="Manage startup projects">
      <div>
        <Flex gap="1rem" style={{ marginBottom: "2rem", flexWrap: "wrap" }}>
          <SearchBar>
            <Search size={18} />
            <input
              placeholder="Search by title or creator…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <ActionBtn
            onClick={fetchAdminProjects}
            style={{
              whiteSpace: "nowrap",
              padding: "0 1.5rem",
              borderRadius: 20,
              border: "none",
              background: "#ffffff",
              boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.12)",
            }}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </ActionBtn>
        </Flex>

        <Flex
          gap="0.75rem"
          style={{
            marginBottom: "1.5rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: 99,
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                background: filter === tab.key ? "#4318FF" : "#ffffff",
                color: filter === tab.key ? "#ffffff" : "#A3AED0",
                boxShadow:
                  filter === tab.key
                    ? "0 4px 12px rgba(67, 24, 255, 0.3)"
                    : "0px 18px 40px rgba(112, 144, 176, 0.08)",
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td style={{ maxWidth: 300 }}>
                      <Flex gap="1rem" align="center">
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#f1f5f9",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={
                              project.image?.startsWith("http")
                                ? project.image
                                : `http://localhost:5000${project.image}`
                            }
                            alt={project.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=150";
                            }}
                          />
                        </div>
                        <div>
                          <p
                            style={{
                              fontWeight: 700,
                              color: "#2B3674",
                              marginBottom: 4,
                            }}
                          >
                            {project.title}
                          </p>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#A3AED0",
                              fontWeight: 500,
                            }}
                          >
                            {project.category} ·{" "}
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </Flex>
                    </td>
                    <td>
                      <p
                        style={{
                          fontWeight: 600,
                          color: "#2B3674",
                          marginBottom: 2,
                        }}
                      >
                        {project.creator?.name || "—"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#A3AED0",
                          fontWeight: 500,
                        }}
                      >
                        {project.creator?.email}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontWeight: 800, color: "#4318FF" }}>
                        ₹{Number(project.targetAmount).toLocaleString("en-IN")}
                      </p>
                    </td>
                    <td>
                      <p style={{ color: "#2B3674", fontWeight: 700 }}>
                        {project.equity}%
                      </p>
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
                              <CheckCircle2 size={14} />
                            </ActionBtn>
                            <ActionBtn
                              $variant="reject"
                              onClick={() =>
                                handleStatusChange(project._id, "rejected")
                              }
                            >
                              <XCircle size={14} />
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
                            <XCircle size={14} />
                          </ActionBtn>
                        )}
                        {project.status === "rejected" && (
                          <ActionBtn
                            $variant="approve"
                            onClick={() =>
                              handleStatusChange(project._id, "approved")
                            }
                          >
                            <CheckCircle2 size={14} />
                          </ActionBtn>
                        )}
                        <ActionBtn
                          onClick={() => navigate(`/projects/${project._id}`)}
                        >
                          <ExternalLink size={14} />
                        </ActionBtn>
                        <ActionBtn
                          $variant="delete"
                          onClick={() => handleDelete(project._id)}
                        >
                          <Trash2 size={14} />
                        </ActionBtn>
                      </Flex>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </TableWrapper>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
