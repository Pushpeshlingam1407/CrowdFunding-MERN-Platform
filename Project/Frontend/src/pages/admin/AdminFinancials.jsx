import {
  DollarSign,
  TrendingUp,
  Search,
  Building2,
  Download,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { Button, Input, Flex } from "../../components/ui";
import { exportToCSV } from "../../utils/export";

import { motion } from "framer-motion";
import "./AdminFinancials.css";

const AdminFinancials = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getInvestments();
      if (res.data.success) {
        setInvestments(res.data.investments || []);
      }
    } catch (err) {
      toast.error("Failed to load financial data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = investments.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const investorName = inv.investor?.name?.toLowerCase() || "";
    const projectName = inv.project?.title?.toLowerCase() || "";
    const creatorName = inv.project?.creator?.name?.toLowerCase() || "";

    const matchesSearch =
      investorName.includes(q) ||
      projectName.includes(q) ||
      creatorName.includes(q);

    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    if (filteredInvestments.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = filteredInvestments.map((inv) => ({
      "Transaction ID": inv._id,
      Date: new Date(inv.createdAt).toLocaleDateString("en-IN"),
      "Investor Name": inv.investor?.name || "Unknown",
      "Investor Role": inv.investor?.role || "Unknown",
      "Amount (INR)": inv.amount,
      "Project Title": inv.project?.title || "Unknown",
      "Creator Name": inv.project?.creator?.name || "Unknown",
      Status: inv.status,
    }));

    exportToCSV(exportData, `financial_ledger_${new Date().getTime()}.csv`);
    toast.success("Ledger exported successfully");
  };

  const totalVolume = investments
    .filter((i) => i.status === "completed" || i.status === "approved")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const platformRevenue = totalVolume * 0.05; // 5% flat fee

  const activeFundraisers = new Set(
    investments.map((i) => i.project?.creator?._id),
  ).size;

  return (
    <AdminLayout title="Financial Activity">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Financial Overview</h1>
          <p className="admin-subtitle">
            Monitor platform-wide fundraising and platform revenue
          </p>
        </div>
        <Button onClick={handleExport} className="btn-export">
          <Download size={16} className="icon-mr" />
          Export CSV Ledger
        </Button>
      </div>

      <div className="admin-stats-grid">
        <motion.div className="admin-stat-card">
          <div
            className="icon-box"
            $bg="rgba(16, 185, 129, 0.08)"
            $color="#10b981"
          >
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalVolume)}
            </h3>
            <p>Total Capital Raised</p>
          </div>
        </motion.div>

        <motion.div className="admin-stat-card">
          <div
            className="icon-box"
            $bg="rgba(16, 185, 129, 0.08)"
            $color="#10b981"
          >
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(platformRevenue)}
            </h3>
            <p>Platform Revenue (5%)</p>
          </div>
        </motion.div>

        <motion.div className="admin-stat-card">
          <div
            className="icon-box"
            $bg="rgba(0, 113, 227, 0.08)"
            $color="#0071e3"
          >
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>
              {
                investments.filter(
                  (i) => i.status === "completed" || i.status === "approved",
                ).length
              }
            </h3>
            <p>Completed Transactions</p>
          </div>
        </motion.div>

        <motion.div className="admin-stat-card">
          <div
            className="icon-box"
            $bg="rgba(139, 92, 246, 0.08)"
            $color="#8b5cf6"
          >
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <h3>{activeFundraisers}</h3>
            <p>Active Fundraisers</p>
          </div>
        </motion.div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h3 className="table-card-title">Recent Transactions</h3>
          <Flex gap="1rem">
            <div className="search-wrapper">
              <Search size={16} className="search-icon-absolute" />
              <Input
                className="admin-search-input"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="admin-capsule-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </Flex>
        </div>

        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Investor (Contributor)</th>
                <th>Amount</th>
                <th>Project Backed</th>
                <th>Creator (Fundraiser)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-cell-center">
                    Loading financial data...
                  </td>
                </tr>
              ) : filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-cell-empty">
                    No investments found.
                  </td>
                </tr>
              ) : (
                filteredInvestments.map((inv) => (
                  <tr key={inv._id}>
                    <td>
                      <div className="text-heavy-dark">
                        {inv.investor?.name || "Unknown"}
                      </div>
                      <div className="text-small-light">
                        {inv.investor?.role || "Investor"}
                      </div>
                    </td>
                    <td className="text-amount-success">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(inv.amount)}
                    </td>
                    <td className="text-medium-weight">
                      {inv.project?.title || "Unknown Project"}
                    </td>
                    <td>
                      <div className="text-medium-dark">
                        {inv.project?.creator?.name || "Unknown"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`admin-status-badge ${inv.status === "completed" ? "completed" : "default"}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-date-mono">
                      {new Intl.DateTimeFormat("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(inv.createdAt))}
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

export default AdminFinancials;
