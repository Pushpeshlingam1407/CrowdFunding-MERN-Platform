import React, { useState, useEffect } from "react";

import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Flag,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Flex } from "../../components/ui";
import AdminLayout from "../../components/AdminLayout";
import "./Complaints.css";





const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getToken = () => localStorage.getItem("adminToken");
  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${getBaseURL()}/admin/complaints`, {
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
      const token = getToken();
      const res = await fetch(
        `${getBaseURL()}/admin/complaints/${id}/resolve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
      .includes(search.toLowerCase()),
  );

  const pending = complaints.filter((c) => c.status === "pending").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <AdminLayout
      title="Compliance Audit"
      subtitle="Review reported bugs, fraud allegations, and irregularities"
    >
      <div>
        <div className="complaints-header-card">
          <Flex
            justify="space-between"
            align="center"
            gap="1rem"
            className="flex-wrap-wrap"
          >
            <Flex gap="2rem" className="flex-wrap-wrap">
              <Flex gap="0.75rem" className="stat-red">
                <ShieldAlert size={20} />
                {pending} PENDING
              </Flex>
              <div className="stat-divider" />
              <Flex gap="0.75rem" className="stat-green">
                <CheckCircle2 size={20} />
                {resolved} RESOLVED
              </Flex>
              <div className="stat-divider" />
              <Flex gap="0.75rem" className="stat-dark">
                <Flag size={20} />
                {complaints.length} TOTAL
              </Flex>
            </Flex>
            <div className="search-container-lg">
              <div className="complaints-search-bar">
                <Search size={16} />
                <input
                  placeholder="Search subject or entity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={fetchComplaints}
              className="btn-refresh-complaints"
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
            </button>
          </Flex>
        </div>

        <div className="complaints-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Issue Summary</th>
                <th>Type</th>
                <th>Reporter</th>
                <th>Target Entity</th>
                <th>Status</th>
                <th>Reported</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="table-cell-empty-bold">
                    Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell-empty-bold">
                    {search
                      ? "No reports match your search."
                      : "Ecosystem secured. No active compliance reports."}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="col-max-w">
                      <h4 className="issue-title">{item.subject}</h4>
                      <p className="issue-desc-trunc">{item.description}</p>
                    </td>

                    <td>
                      <span className={`complaints-type-badge ${item.type || 'default'}`}>{item.type}</span>
                    </td>

                    <td>
                      <Flex gap="0.75rem" align="center">
                        <div className="complaints-avatar">{item.author?.name?.charAt(0) || "?"}</div>
                        <div>
                          <p className="reporter-name">
                            {item.author?.name || "Unknown"}
                          </p>
                          <p className="user-email-light">
                            {item.author?.email}
                          </p>
                        </div>
                      </Flex>
                    </td>

                    <td>
                      <p className="target-entity-name">
                        {item.targetCompany?.name || "N/A"}
                      </p>
                      <p className="user-email-light">
                        {item.targetCompany?.email}
                      </p>
                    </td>

                    <td>
                      <span className={`complaints-status-badge ${item.status || 'pending'}`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap">
                      <Flex
                        gap="0.4rem"
                        align="center"
                        className="date-mono-dark"
                      >
                        <Clock size={14} className="icon-gray" />
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Flex>
                    </td>

                    <td>
                      <Flex gap="0.5rem">
                        {item.status !== "resolved" && (
                          <button className="complaints-action-btn" onClick={() => resolveComplaint(item._id)}>
                            <CheckCircle2 size={13} />
                            Resolve
                          </button>
                        )}
                        {item.status === "resolved" && (
                          <span className="text-resolved-success">
                            ✓ Resolved
                          </span>
                        )}
                      </Flex>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminComplaints;
