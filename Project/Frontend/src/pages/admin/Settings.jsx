import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  Globe,
  Lock,
  Users,
  Save,
  RefreshCw,
  CheckCircle2,
  Eye,
  EyeOff,
  DollarSign,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Flex } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import "./Settings.css";

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    platformName: "StartupFund",
    autoApprove: false,
    requireVerification: true,
    allowPublicProfiles: true,
    maxInvestmentAmount: 1000000,
    minInvestmentAmount: 1000,
    defaultEquityCap: 25,
    maintenanceMode: false,
    emailNotifications: true,
    investmentAlerts: true,
    newUserAlerts: true,
    reportAlerts: true,
    defaultCurrency: "INR",
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    adminPassword: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("adminPlatformSettings");
    if (saved) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toSave = { ...settings };
      delete toSave.adminPassword;
      localStorage.setItem("adminPlatformSettings", JSON.stringify(toSave));

      if (settings.adminPassword) {
        const token =
          localStorage.getItem("adminToken") || localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/auth/admin/password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword: settings.adminPassword }),
          },
        );
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to update password");
        update("adminPassword", "");
      }

      await new Promise((r) => setTimeout(r, 400));
      setSaved(true);
      toast.success("Platform settings saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Platform Settings"
      subtitle="Configure platform-wide policies, security, and access controls."
    >
      <div className="settings-container">
        <Flex justify="flex-end" className="flex-end-mb">
          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <RefreshCw size={16} className="spin" />
            ) : saved ? (
              <CheckCircle2 size={16} />
            ) : (
              <Save size={16} />
            )}
            {saving
              ? "Saving..."
              : saved
                ? "Saved Successfully"
                : "Save Changes"}
          </button>
        </Flex>

        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="settings-section-header">
            <div
              className="settings-section-icon"
              $bg="rgba(0, 113, 227, 0.08)"
              $color="#0071e3"
            >
              <Globe size={24} />
            </div>
            <div>
              <h3 className="settings-section-title">General Preferences</h3>
              <p className="settings-section-desc">
                Core platform configuration and branding
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Platform Name</h4>
              <p>The name displayed across the platform interface</p>
            </div>
            <input
              className="settings-input"
              value={settings.platformName}
              onChange={(e) => update("platformName", e.target.value)}
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Default Currency</h4>
              <p>Currency used for all funding calculations</p>
            </div>
            <select
              className="settings-select"
              value={settings.defaultCurrency}
              onChange={(e) => update("defaultCurrency", e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Maintenance Mode</h4>
              <p>Temporarily disable public access to perform maintenance</p>
            </div>
            <button
              className={`settings-toggle ${settings.maintenanceMode ? "on" : ""}`}
              onClick={() =>
                update("maintenanceMode", !settings.maintenanceMode)
              }
            />
          </div>
        </motion.div>

        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="settings-section-header">
            <div
              className="settings-section-icon"
              $bg="rgba(16, 185, 129, 0.08)"
              $color="#10b981"
            >
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="settings-section-title">
                Campaign & Funding Rules
              </h3>
              <p className="settings-section-desc">
                Configure limits, caps, and workflow automation
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Auto-Approve Campaigns</h4>
              <p>Skip the manual admin review for new campaign submissions</p>
            </div>
            <button
              className={`settings-toggle ${settings.autoApprove ? "on" : ""}`}
              onClick={() => update("autoApprove", !settings.autoApprove)}
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Minimum Investment (₹)</h4>
              <p>Smallest allowed investment amount per user</p>
            </div>
            <input
              className="settings-input font-mono"
              style={{ width: "140px" }}
              type="number"
              value={settings.minInvestmentAmount}
              onChange={(e) =>
                update("minInvestmentAmount", Number(e.target.value))
              }
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Maximum Investment (₹)</h4>
              <p>Largest allowed single investment transaction</p>
            </div>
            <input
              className="settings-input font-mono"
              style={{ width: "140px" }}
              type="number"
              value={settings.maxInvestmentAmount}
              onChange={(e) =>
                update("maxInvestmentAmount", Number(e.target.value))
              }
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Default Equity Cap (%)</h4>
              <p>Maximum equity percentage startups can offer</p>
            </div>
            <input
              className="settings-input font-mono"
              style={{ width: "100px" }}
              type="number"
              value={settings.defaultEquityCap}
              onChange={(e) =>
                update("defaultEquityCap", Number(e.target.value))
              }
            />
          </div>
        </motion.div>

        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="settings-section-header">
            <div
              className="settings-section-icon"
              $bg="rgba(139, 92, 246, 0.08)"
              $color="#8b5cf6"
            >
              <Users size={24} />
            </div>
            <div>
              <h3 className="settings-section-title">User Management</h3>
              <p className="settings-section-desc">
                Policies governing user accounts and public visibility
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Require Email Verification</h4>
              <p>Users must verify their email before investing or raising</p>
            </div>
            <button
              className={`settings-toggle ${settings.requireVerification ? "on" : ""}`}
              onClick={() =>
                update("requireVerification", !settings.requireVerification)
              }
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Public Company Profiles</h4>
              <p>Allow non-logged-in visitors to view company details</p>
            </div>
            <button
              className={`settings-toggle ${settings.allowPublicProfiles ? "on" : ""}`}
              onClick={() =>
                update("allowPublicProfiles", !settings.allowPublicProfiles)
              }
            />
          </div>
        </motion.div>

        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="settings-section-header">
            <div
              className="settings-section-icon"
              $bg="rgba(239, 68, 68, 0.08)"
              $color="#ef4444"
            >
              <Bell size={24} />
            </div>
            <div>
              <h3 className="settings-section-title">Admin Alerts</h3>
              <p className="settings-section-desc">
                Control system-generated notifications
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Email Notifications</h4>
              <p>Receive administrative alerts directly via email</p>
            </div>
            <button
              className={`settings-toggle ${settings.emailNotifications ? "on" : ""}`}
              onClick={() =>
                update("emailNotifications", !settings.emailNotifications)
              }
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>New Investment Alerts</h4>
              <p>Get notified instantly when large investments are placed</p>
            </div>
            <button
              className={`settings-toggle ${settings.investmentAlerts ? "on" : ""}`}
              onClick={() =>
                update("investmentAlerts", !settings.investmentAlerts)
              }
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>New User Registration Alerts</h4>
              <p>Get notified when new startups or investors sign up</p>
            </div>
            <button
              className={`settings-toggle ${settings.newUserAlerts ? "on" : ""}`}
              onClick={() => update("newUserAlerts", !settings.newUserAlerts)}
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Compliance & Fraud Alerts</h4>
              <p>Immediate alerts for flagged users or complaints</p>
            </div>
            <button
              className={`settings-toggle ${settings.reportAlerts ? "on" : ""}`}
              onClick={() => update("reportAlerts", !settings.reportAlerts)}
            />
          </div>
        </motion.div>

        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="settings-section-header">
            <div
              className="settings-section-icon"
              $bg="rgba(110, 110, 115, 0.08)"
              $color="#6e6e73"
            >
              <Lock size={24} />
            </div>
            <div>
              <h3 className="settings-section-title">
                Security & Access Control
              </h3>
              <p className="settings-section-desc">
                Protecting platform integrity and admin accounts
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Session Timeout (minutes)</h4>
              <p>Automatically log out inactive administrator sessions</p>
            </div>
            <input
              className="settings-input font-mono"
              style={{ width: "100px" }}
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => update("sessionTimeout", Number(e.target.value))}
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Max Login Attempts</h4>
              <p>Lock an account temporarily after failed login attempts</p>
            </div>
            <input
              className="settings-input font-mono"
              style={{ width: "100px" }}
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                update("maxLoginAttempts", Number(e.target.value))
              }
            />
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <h4>Update Admin Password</h4>
              <p>Securely change your administrator account password</p>
            </div>
            <div className="password-input-wrapper">
              <input
                className="settings-input"
                style={{ width: "220px" }}
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={settings.adminPassword}
                onChange={(e) => update("adminPassword", e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="btn-toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
