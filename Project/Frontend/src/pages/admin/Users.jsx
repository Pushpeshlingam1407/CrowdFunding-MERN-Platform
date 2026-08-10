import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Mail,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Flex } from "../../components/ui";
import AdminLayout from "../../components/AdminLayout";
import "./Users.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");
  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
      const response = await fetch(
        `${getBaseURL()}/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
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
      const response = await fetch(
        `${getBaseURL()}/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isVerified: !currentStatus }),
        },
      );
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
        <Flex gap="1rem" className="filters-row-users">
          <div className="users-search-bar">
            <Search size={18} />
            <input
              placeholder="Refine by name, email, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={fetchUsers}
            className="users-action-btn default btn-refresh-users"
          >
            <RefreshCw
              size={16}
              className={loading ? "spin icon-mr-sm" : "icon-mr-sm"}
            />{" "}
            Refresh
          </button>
        </Flex>

        <div className="users-table-wrapper">
          {loading ? (
            <div className="users-empty-state">
              <RefreshCw size={32} className="spin" />
              <p>Loading ecosystem...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="users-empty-state">
              <UsersIcon size={36} />
              <p>No users found in the ecosystem.</p>
            </div>
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
                    <td className="col-user-max-w">
                      <Flex gap="1rem">
                        <div className="users-avatar">
                          {user.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <h4 className="user-name-text">{user.name}</h4>
                          <p className="user-meta-text">
                            {user.companyName || user.email}
                          </p>
                        </div>
                      </Flex>
                    </td>
                    <td>
                      <Flex gap="0.75rem" align="center">
                        <span
                          className={`users-role-badge ${["startup", "investor", "mnc", "admin"].includes(user.role) ? user.role : "default"}`}
                        >
                          {user.role}
                        </span>
                        {user.role !== "admin" && (
                          <select
                            className="users-role-select"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                          >
                            <option value="startup">Startup</option>
                            <option value="investor">Investor</option>
                            <option value="mnc">MNC</option>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </Flex>
                    </td>
                    <td>
                      <Flex gap="0.75rem" align="center">
                        <span
                          className={`users-verified-badge ${user.isVerified ? "verified" : "unverified"}`}
                        >
                          {user.isVerified ? "Verified User" : "Unverified"}
                        </span>
                      </Flex>
                    </td>
                    <td>
                      <p className="date-mono-dark">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <button
                          className="users-action-btn default"
                          title="Email User"
                          onClick={() => window.open(`mailto:${user.email}`)}
                        >
                          <Mail size={14} />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            className={`users-action-btn ${user.isVerified ? "ban" : "verify"}`}
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
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            className="users-action-btn delete"
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </Flex>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
