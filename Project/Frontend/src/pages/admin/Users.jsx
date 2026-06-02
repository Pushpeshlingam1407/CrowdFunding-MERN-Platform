import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Settings,
  MoreVertical,
  Mail,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
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

const RoleBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  ${(props) =>
    props.role === "startup"
      ? `background: rgba(67, 24, 255, 0.1); color: #4318FF;`
      : props.role === "investor"
        ? `background: rgba(5, 205, 153, 0.1); color: #05CD99;`
        : props.role === "mnc"
          ? `background: rgba(168, 85, 247, 0.1); color: #A855F7;`
          : props.role === "admin"
            ? `background: rgba(255, 181, 71, 0.1); color: #FFB547;`
            : `background: rgba(163, 174, 208, 0.1); color: #A3AED0;`}
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
      ? `background: rgba(5, 205, 153, 0.1); color: #05CD99;`
      : `background: rgba(227, 26, 26, 0.1); color: #E31A1A;`}
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
    props.$variant === "verify"
      ? `color: #05CD99; border-color: rgba(5,205,153,0.3); &:hover { background: rgba(5,205,153,0.1); }`
      : props.$variant === "ban"
        ? `color: #FFB547; border-color: rgba(255,181,71,0.3); &:hover { background: rgba(255,181,71,0.1); }`
        : props.$variant === "delete"
          ? `color: #E31A1A; border-color: rgba(227,26,26,0.3); &:hover { background: rgba(227,26,26,0.1); }`
          : `color: #4318FF; border-color: rgba(67,24,255,0.3); &:hover { background: rgba(67,24,255,0.1); }`}
`;

const RoleSelect = styled.select`
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  background: #ffffff;
  color: #2b3674;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #4318ff;
    box-shadow: 0 0 0 3px rgba(67, 24, 255, 0.1);
  }
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

const EmptyState = styled.div`
  padding: 5rem 2rem;
  text-align: center;
  color: #a3aed0;

  svg {
    margin: 0 auto 1rem;
    display: block;
    opacity: 0.4;
  }
  p {
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4318ff 0%, #868cff 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(67, 24, 255, 0.2);
`;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => localStorage.getItem("adminToken") || localStorage.getItem("token");
  const getBaseURL = () => import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getBaseURL()}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load");
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      toast.error("Failed to load user ecosystem");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${getBaseURL()}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
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
      const response = await fetch(`${getBaseURL()}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      toast.success(
        !currentStatus ? "User verified successfully" : "Verification revoked",
      );
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Verification update failed");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Permanently delete user "${userName}"? This action cannot be undone.`,
      )
    )
      return;
    try {
      const response = await fetch(`${getBaseURL()}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
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
    <AdminLayout
      title="Ecosystem Management"
      subtitle="Moderating professional accounts"
    >
      <div>
        <Flex gap="1rem" style={{ marginBottom: "2rem" }}>
          <SearchBar>
            <Search size={18} />
            <input
              placeholder="Refine by name, email, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <ActionBtn
            onClick={fetchUsers}
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

        <TableWrapper>
          {loading ? (
            <EmptyState>
              <RefreshCw size={32} className="spin" />
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td style={{ maxWidth: "300px" }}>
                      <Flex gap="1rem">
                        <Avatar>{user.name?.charAt(0) || "?"}</Avatar>
                        <div>
                          <h4
                            style={{
                              fontWeight: 700,
                              marginBottom: "0.15rem",
                              color: "#2B3674",
                            }}
                          >
                            {user.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#A3AED0",
                              fontWeight: 500,
                            }}
                          >
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
                      <Flex gap="0.75rem" align="center">
                        <VerifiedBadge $verified={user.isVerified}>
                          {user.isVerified ? "Verified User" : "Unverified"}
                        </VerifiedBadge>
                      </Flex>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: "#2B3674" }}>
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <ActionBtn title="Email User">
                          <Mail size={14} />
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
                        <ActionBtn
                          $variant="delete"
                          onClick={() => handleDeleteUser(user._id, user.name)}
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

export default AdminUsers;

