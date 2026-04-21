import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Filter,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Settings,
  MoreVertical,
  Mail,
  UserCheck,
  RefreshCw,
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
import useAuthStore from "../../store/authStore";

const AdminWrapper = styled.div`
  min-height: 100vh;
  background: #0f172a;
  padding: 3rem 0;
`;

const TableWrapper = styled.div`
  background: #1e293b;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #334155;
  margin-top: 2rem;

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

const RoleBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  ${(props) =>
    props.role === "startup"
      ? `
    background: rgba(56,189,248,0.12);
    color: #38bdf8;
    border: 1px solid rgba(56,189,248,0.25);
  `
      : props.role === "investor"
        ? `
    background: rgba(34,197,94,0.12);
    color: #4ade80;
    border: 1px solid rgba(34,197,94,0.25);
  `
        : props.role === "mnc"
          ? `
    background: rgba(168,85,247,0.12);
    color: #c084fc;
    border: 1px solid rgba(168,85,247,0.25);
  `
          : props.role === "admin"
            ? `
    background: rgba(251,191,36,0.12);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.25);
  `
            : `
    background: rgba(148,163,184,0.12);
    color: #94a3b8;
    border: 1px solid rgba(148,163,184,0.25);
  `}
`;

const VerifiedBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) =>
    props.$verified
      ? `
    background: rgba(34,197,94,0.12);
    color: #4ade80;
    border: 1px solid rgba(34,197,94,0.25);
  `
      : `
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.25);
  `}
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
  background: transparent;

  ${(props) =>
    props.$variant === "verify"
      ? `
    color: #4ade80;
    border-color: rgba(34,197,94,0.35);
    &:hover { background: rgba(34,197,94,0.1); }
  `
      : props.$variant === "ban"
        ? `
    color: #fbbf24;
    border-color: rgba(251,191,36,0.35);
    &:hover { background: rgba(251,191,36,0.1); }
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

const RoleSelect = styled.select`
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  background: #0f172a;
  color: #e2e8f0;
  border: 1px solid #334155;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #38bdf8;
  }
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

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load");
      // API returns { success, users } — extract the users array
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      toast.error("Failed to load user ecosystem");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${BASE}/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Role update failed");
    }
  };

  const handleVerifyToggle = async (userId, currentStatus) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${BASE}/api/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isVerified: !currentStatus }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      toast.success(
        !currentStatus
          ? "User verified successfully"
          : "Verification revoked",
      );
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Verification update failed");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Permanently delete user "${userName}"? This action cannot be undone.`)) return;
    try {
      const token = getToken();
      const response = await fetch(`${BASE}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminWrapper>
      <Container>
        <header style={{ marginBottom: "2.5rem" }}>
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
          <Flex justify="space-between">
            <div>
              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  color: "#f8fafc",
                  marginBottom: "0.5rem",
                }}
              >
                Ecosystem Management
              </h1>
              <p style={{ color: "#64748b" }}>
                Moderating professional accounts, startups, and enterprise
                entities.
              </p>
            </div>
            <ActionBtn onClick={fetchUsers} style={{ whiteSpace: "nowrap" }}>
              <RefreshCw size={14} /> Refresh
            </ActionBtn>
          </Flex>
        </header>

        {/* Search bar */}
        <Flex gap="1rem" style={{ marginBottom: "1.5rem" }}>
          <SearchBar>
            <Search size={16} />
            <input
              placeholder="Refine by name, email, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
        </Flex>

        <TableWrapper>
          {loading ? (
            <EmptyState>
              <RefreshCw size={32} />
              <p>Loading ecosystem...</p>
            </EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState>
              <UsersIcon size={36} />
              <p>No users found in the ecosystem.</p>
            </EmptyState>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>PROFESSIONAL ENTITY</th>
                  <th>ACCOUNT TYPE</th>
                  <th>STATUS</th>
                  <th>ONBOARDED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td style={{ maxWidth: "300px" }}>
                      <Flex gap="1rem">
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            background: "rgba(56,189,248,0.1)",
                            color: "#38bdf8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {user.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <h4
                            style={{
                              fontWeight: 700,
                              marginBottom: "0.15rem",
                              color: "#f1f5f9",
                            }}
                          >
                            {user.name}
                          </h4>
                          <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                            {user.companyName || user.email}
                          </p>
                        </div>
                      </Flex>
                    </td>
                    <td>
                      <Flex gap="0.75rem" align="center">
                        <RoleBadge role={user.role}>{user.role}</RoleBadge>
                        {user.role !== "admin" && (
                          <RoleSelect
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                          >
                            <option value="startup">Startup</option>
                            <option value="investor">Investor</option>
                            <option value="mnc">MNC</option>
                            <option value="employee">Employee</option>
                          </RoleSelect>
                        )}
                      </Flex>
                    </td>
                    <td>
                      <VerifiedBadge $verified={user.isVerified}>
                        {user.isVerified ? "✓ Verified" : "Unverified"}
                      </VerifiedBadge>
                    </td>
                    <td>
                      <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <ActionBtn
                          onClick={() => navigate(`/company/${user._id}`)}
                          title="View Profile"
                        >
                          <UserCheck size={14} />
                        </ActionBtn>
                        <ActionBtn
                          $variant={user.isVerified ? "ban" : "verify"}
                          onClick={() =>
                            handleVerifyToggle(user._id, user.isVerified)
                          }
                          title={
                            user.isVerified
                              ? "Revoke Verification"
                              : "Verify User"
                          }
                        >
                          {user.isVerified ? (
                            <ShieldAlert size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                        </ActionBtn>
                        {user.role !== "admin" && (
                          <ActionBtn
                            $variant="delete"
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </ActionBtn>
                        )}
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

export default AdminUsers;
