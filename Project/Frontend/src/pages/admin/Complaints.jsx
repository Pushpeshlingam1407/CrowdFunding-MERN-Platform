import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Flag,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
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

const TypeBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${(props) =>
    props.type === "fraud"
      ? "background: rgba(227, 26, 26, 0.1); color: #E31A1A;"
      : props.type === "unpaid"
      ? "background: rgba(255, 181, 71, 0.1); color: #FFB547;"
      : props.type === "bug"
      ? "background: rgba(67, 24, 255, 0.1); color: #4318FF;"
      : "background: rgba(5, 205, 153, 0.1); color: #05CD99;"}
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  ${(props) =>
    props.status === "resolved"
      ? "background: rgba(5, 205, 153, 0.1); color: #05CD99;"
      : props.status === "in-progress"
      ? "background: rgba(67, 24, 255, 0.1); color: #4318FF;"
      : "background: rgba(227, 26, 26, 0.1); color: #E31A1A;"}
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

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
  background: #ffffff;
  color: #05CD99;
  border-color: rgba(5,205,153,0.3);
  &:hover { background: rgba(5,205,153,0.1); }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4318FF 0%, #868CFF 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(67, 24, 255, 0.2);
`;

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getToken = () => localStorage.getItem("adminToken");
  const getBaseURL = () => import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const res = await fetch(`${getBaseURL()}/admin/complaints/${id}/resolve`, {
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
    <AdminLayout title="Compliance Audit" subtitle="Review reported bugs, fraud allegations, and irregularities">
      <div>
        <div style={{ background: "#ffffff", border: "none", borderRadius: 20, padding: "1.5rem", boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.12)" }}>
          <Flex justify="space-between" align="center" gap="1rem" style={{ flexWrap: "wrap" }}>
            <Flex gap="2rem">
              <Flex gap="0.75rem" style={{ color: "#E31A1A", fontWeight: 800 }}>
                <ShieldAlert size={20} />
                {pending} PENDING
              </Flex>
              <div style={{ height: "24px", width: "1px", background: "#e2e8f0" }} />
              <Flex gap="0.75rem" style={{ color: "#05CD99", fontWeight: 800 }}>
                <CheckCircle2 size={20} />
                {resolved} RESOLVED
              </Flex>
              <div style={{ height: "24px", width: "1px", background: "#e2e8f0" }} />
              <Flex gap="0.75rem" style={{ color: "#2B3674", fontWeight: 800 }}>
                <Flag size={20} />
                {complaints.length} TOTAL
              </Flex>
            </Flex>
            <div style={{ position: "relative", width: "340px" }}>
              <SearchBar>
                <Search size={16} />
                <input
                  placeholder="Search subject or entity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </SearchBar>
            </div>
            <button 
              onClick={fetchComplaints} 
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
                  <td colSpan={7} style={{ textAlign: "center", padding: "4rem", color: "#A3AED0", fontWeight: 600 }}>
                    Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "4rem", color: "#A3AED0", fontWeight: 600 }}>
                    {search ? "No reports match your search." : "Ecosystem secured. No active compliance reports."}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td style={{ maxWidth: "280px" }}>
                      <h4 style={{ fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.95rem", color: "#2B3674" }}>
                        {item.subject}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "#A3AED0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.description}
                      </p>
                    </td>

                    <td>
                      <TypeBadge type={item.type}>{item.type}</TypeBadge>
                    </td>

                    <td>
                      <Flex gap="0.75rem" align="center">
                        <Avatar>{item.author?.name?.charAt(0) || "?"}</Avatar>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#2B3674" }}>{item.author?.name || "Unknown"}</p>
                          <p style={{ fontSize: "0.75rem", color: "#A3AED0", fontWeight: 500 }}>{item.author?.email}</p>
                        </div>
                      </Flex>
                    </td>

                    <td>
                      <p style={{ fontWeight: 800, fontSize: "0.85rem", color: "#4318FF" }}>
                        {item.targetCompany?.name || "N/A"}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#A3AED0", fontWeight: 500 }}>{item.targetCompany?.email}</p>
                    </td>

                    <td>
                      <StatusBadge status={item.status}>{item.status}</StatusBadge>
                    </td>

                    <td style={{ whiteSpace: "nowrap" }}>
                      <Flex gap="0.4rem" align="center" style={{ color: "#2B3674", fontSize: "0.85rem", fontWeight: 700 }}>
                        <Clock size={14} style={{ color: "#A3AED0" }} />
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </Flex>
                    </td>

                    <td>
                      <Flex gap="0.5rem">
                        {item.status !== "resolved" && (
                          <ActionBtn onClick={() => resolveComplaint(item._id)}>
                            <CheckCircle2 size={13} />
                            Resolve
                          </ActionBtn>
                        )}
                        {item.status === "resolved" && (
                          <span style={{ color: "#05CD99", fontWeight: 800, fontSize: "0.85rem" }}>✓ Resolved</span>
                        )}
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

export default AdminComplaints;

