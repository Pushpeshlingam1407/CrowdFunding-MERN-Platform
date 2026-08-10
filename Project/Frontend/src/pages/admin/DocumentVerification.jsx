import React, { useState, useEffect } from "react";

import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Flex } from "../../components/ui";
import AdminLayout from "../../components/AdminLayout";
import "./DocumentVerification.css";

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
    <AdminLayout
      title="KYC & Verification"
      subtitle="Audit identity proofs and professional certificates in our ecosystem."
    >
      <div>
        <div className="verify-header-card">
          <Flex
            justify="space-between"
            align="center"
            gap="1rem"
            className="flex-wrap-wrap"
          >
            <Flex gap="2.5rem" className="flex-wrap-wrap">
              <div className="text-center">
                <h3 className="stat-large-red">{verifications.length}</h3>
                <p className="stat-subtext">Awaiting Audit</p>
              </div>
              <div className="stat-divider-lg" />
              <div className="text-center">
                <h3 className="stat-large-dark">1,124</h3>
                <p className="stat-subtext">Verified Entities</p>
              </div>
            </Flex>
            <div className="search-container-lg">
              <div className="verification-search-bar">
                <Search size={16} />
                <input placeholder="Search entity name..." />
              </div>
            </div>
            <button onClick={fetchVerifications} className="btn-refresh-verify">
              <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
            </button>
          </Flex>
        </div>

        <div className="verification-table-wrapper">
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
                  <td colSpan={5} className="table-cell-empty-bold">
                    Loading queue...
                  </td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-cell-empty-bold">
                    Audit queue is empty. System secured.
                  </td>
                </tr>
              ) : (
                verifications.map((verify) => (
                  <tr key={verify._id}>
                    <td>
                      <Flex gap="1rem">
                        <div className="verification-avatar">
                          {verify.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="entity-name">{verify.user?.name}</p>
                          <p className="entity-email">{verify.user?.email}</p>
                        </div>
                      </Flex>
                    </td>
                    <td>
                      <Flex gap="0.5rem" className="flex-wrap-wrap">
                        <span className="verification-doc-badge">
                          IDENTITY PROOF
                        </span>
                        <span className="verification-doc-badge">ADDRESS</span>
                      </Flex>
                    </td>
                    <td>
                      <Flex
                        gap="0.5rem"
                        align="center"
                        className="date-mono-dark"
                      >
                        <Calendar size={14} className="icon-gray" /> Aug 12,
                        2026
                      </Flex>
                    </td>
                    <td>
                      <Flex
                        gap="0.5rem"
                        align="center"
                        className="status-safe-badge"
                      >
                        <ShieldCheck size={16} /> SAFE
                      </Flex>
                    </td>
                    <td>
                      <Flex gap="0.5rem">
                        <button
                          className="verification-action-btn default"
                          onClick={() =>
                            window.open(verify.identityProof, "_blank")
                          }
                          title="Inspect Document"
                        >
                          <Eye size={14} className="icon-mr-sm" /> Inspect
                        </button>
                        <button
                          className="verification-action-btn approve"
                          onClick={() =>
                            handleVerify(verify.user?._id, 0, "verified")
                          }
                          title="Approve Document"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          className="verification-action-btn reject"
                          onClick={() =>
                            handleVerify(verify.user?._id, 0, "rejected")
                          }
                          title="Reject Document"
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDocumentVerification;
