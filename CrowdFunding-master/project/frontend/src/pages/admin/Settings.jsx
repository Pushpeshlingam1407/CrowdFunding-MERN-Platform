import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Settings,
  ArrowLeft,
  Shield,
  Bell,
  Globe,
  Lock,
  Users,
  Save,
  RefreshCw,
  CheckCircle2,
  Eye,
  EyeOff,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import { Flex } from "../../components/ui";
import useAuthStore from "../../store/authStore";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #080e1a;
  padding: 0;
`;

const PageBody = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
`;

const BackBtn = styled.button`
  background: none;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  &:hover { border-color: #64748b; color: #e2e8f0; }
`;

const Heading = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: #f8fafc;
  margin-bottom: 0.5rem;
`;

const SubHeading = styled.p`
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
`;

const Section = styled(motion.div)`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 2rem;
  margin-bottom: 1.25rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #1e293b;
`;

const SectionIcon = styled.div`
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: ${p => p.$bg};
  color: ${p => p.$color};
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem; font-weight: 800; color: #e2e8f0;
`;

const SectionDesc = styled.p`
  font-size: 0.8rem; color: #475569;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #0f172a;
  &:last-child { border-bottom: none; }
`;

const SettingLabel = styled.div`
  h4 { font-size: 0.92rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.2rem; }
  p { font-size: 0.78rem; color: #475569; }
`;

const Toggle = styled.button`
  width: 48px; height: 26px;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  background: ${p => p.$on ? '#10b981' : '#334155'};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${p => p.$on ? '24px' : '3px'};
    width: 20px; height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s;
  }
`;

const InputField = styled.input`
  padding: 0.6rem 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.9rem;
  outline: none;
  width: ${p => p.$w || '200px'};
  transition: border-color 0.2s;
  &:focus { border-color: #38bdf8; }
  &::placeholder { color: #475569; }
`;

const SelectField = styled.select`
  padding: 0.6rem 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #38bdf8; }
`;

const SaveBtn = styled.button`
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  border: none; border-radius: 10px;
  color: white; font-weight: 700; font-size: 0.9rem;
  cursor: pointer; transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const AdminSettings = () => {
  const navigate = useNavigate();
  const { adminUser } = useAuthStore();

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("adminPlatformSettings");
    if (saved) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
  }, []);

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Persist to localStorage (would be a backend API in production)
      const toSave = { ...settings };
      delete toSave.adminPassword; // Don't persist password changes to localStorage
      localStorage.setItem("adminPlatformSettings", JSON.stringify(toSave));

      // If password is being changed, update it via API
      if (settings.adminPassword) {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ password: settings.adminPassword }),
        });
        if (!res.ok) throw new Error("Failed to update password");
        update("adminPassword", "");
      }

      await new Promise(r => setTimeout(r, 400)); // Simulate save
      setSaved(true);
      toast.success("Platform settings saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrapper>
      <PageBody>
        <BackBtn onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={15} /> Back to Overview
        </BackBtn>

        <Flex justify="space-between" align="flex-start" style={{ marginBottom: '0.5rem' }}>
          <div>
            <Heading>Admin Settings</Heading>
            <SubHeading>Configure platform-wide policies, security, and access controls.</SubHeading>
          </div>
          <SaveBtn onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw size={16} className="spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </SaveBtn>
        </Flex>

        {/* Platform General */}
        <Section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionHeader>
            <SectionIcon $bg="rgba(56,189,248,0.1)" $color="#38bdf8"><Globe size={20} /></SectionIcon>
            <div>
              <SectionTitle>General</SectionTitle>
              <SectionDesc>Core platform configuration</SectionDesc>
            </div>
          </SectionHeader>

          <SettingRow>
            <SettingLabel>
              <h4>Platform Name</h4>
              <p>The name displayed across the platform</p>
            </SettingLabel>
            <InputField value={settings.platformName} onChange={e => update("platformName", e.target.value)} />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Default Currency</h4>
              <p>Currency used across the platform</p>
            </SettingLabel>
            <SelectField value={settings.defaultCurrency} onChange={e => update("defaultCurrency", e.target.value)}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </SelectField>
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Maintenance Mode</h4>
              <p>Temporarily disable public access for maintenance</p>
            </SettingLabel>
            <Toggle $on={settings.maintenanceMode} onClick={() => update("maintenanceMode", !settings.maintenanceMode)} />
          </SettingRow>
        </Section>

        {/* Campaign Settings */}
        <Section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionHeader>
            <SectionIcon $bg="rgba(74,222,128,0.1)" $color="#4ade80"><DollarSign size={20} /></SectionIcon>
            <div>
              <SectionTitle>Campaign & Investment</SectionTitle>
              <SectionDesc>Configure funding rules and limits</SectionDesc>
            </div>
          </SectionHeader>

          <SettingRow>
            <SettingLabel>
              <h4>Auto-Approve Campaigns</h4>
              <p>Skip manual review for new campaign submissions</p>
            </SettingLabel>
            <Toggle $on={settings.autoApprove} onClick={() => update("autoApprove", !settings.autoApprove)} />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Minimum Investment (₹)</h4>
              <p>Smallest allowed investment amount</p>
            </SettingLabel>
            <InputField
              type="number" $w="140px"
              value={settings.minInvestmentAmount}
              onChange={e => update("minInvestmentAmount", Number(e.target.value))}
            />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Maximum Investment (₹)</h4>
              <p>Largest allowed single investment</p>
            </SettingLabel>
            <InputField
              type="number" $w="140px"
              value={settings.maxInvestmentAmount}
              onChange={e => update("maxInvestmentAmount", Number(e.target.value))}
            />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Default Equity Cap (%)</h4>
              <p>Maximum equity percentage for campaigns</p>
            </SettingLabel>
            <InputField
              type="number" $w="100px"
              value={settings.defaultEquityCap}
              onChange={e => update("defaultEquityCap", Number(e.target.value))}
            />
          </SettingRow>
        </Section>

        {/* User & Access */}
        <Section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionHeader>
            <SectionIcon $bg="rgba(251,191,36,0.1)" $color="#fbbf24"><Users size={20} /></SectionIcon>
            <div>
              <SectionTitle>Users & Access</SectionTitle>
              <SectionDesc>User registration and profile policies</SectionDesc>
            </div>
          </SectionHeader>

          <SettingRow>
            <SettingLabel>
              <h4>Require Email Verification</h4>
              <p>Users must verify email before accessing features</p>
            </SettingLabel>
            <Toggle $on={settings.requireVerification} onClick={() => update("requireVerification", !settings.requireVerification)} />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Public Company Profiles</h4>
              <p>Allow non-logged-in users to view company profiles</p>
            </SettingLabel>
            <Toggle $on={settings.allowPublicProfiles} onClick={() => update("allowPublicProfiles", !settings.allowPublicProfiles)} />
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionHeader>
            <SectionIcon $bg="rgba(248,113,113,0.1)" $color="#f87171"><Bell size={20} /></SectionIcon>
            <div>
              <SectionTitle>Notifications</SectionTitle>
              <SectionDesc>Admin alert preferences</SectionDesc>
            </div>
          </SectionHeader>

          <SettingRow>
            <SettingLabel>
              <h4>Email Notifications</h4>
              <p>Receive admin alerts via email</p>
            </SettingLabel>
            <Toggle $on={settings.emailNotifications} onClick={() => update("emailNotifications", !settings.emailNotifications)} />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>New Investment Alerts</h4>
              <p>Get notified when investments are made</p>
            </SettingLabel>
            <Toggle $on={settings.investmentAlerts} onClick={() => update("investmentAlerts", !settings.investmentAlerts)} />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>New User Registration Alerts</h4>
              <p>Get notified when new users sign up</p>
            </SettingLabel>
            <Toggle $on={settings.newUserAlerts} onClick={() => update("newUserAlerts", !settings.newUserAlerts)} />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Report / Complaint Alerts</h4>
              <p>Get notified when users file reports</p>
            </SettingLabel>
            <Toggle $on={settings.reportAlerts} onClick={() => update("reportAlerts", !settings.reportAlerts)} />
          </SettingRow>
        </Section>

        {/* Security */}
        <Section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionHeader>
            <SectionIcon $bg="rgba(167,139,250,0.1)" $color="#a78bfa"><Lock size={20} /></SectionIcon>
            <div>
              <SectionTitle>Security</SectionTitle>
              <SectionDesc>Authentication and session policies</SectionDesc>
            </div>
          </SectionHeader>

          <SettingRow>
            <SettingLabel>
              <h4>Session Timeout (minutes)</h4>
              <p>Auto-logout after inactivity</p>
            </SettingLabel>
            <InputField
              type="number" $w="100px"
              value={settings.sessionTimeout}
              onChange={e => update("sessionTimeout", Number(e.target.value))}
            />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Max Login Attempts</h4>
              <p>Lock account after failed attempts</p>
            </SettingLabel>
            <InputField
              type="number" $w="100px"
              value={settings.maxLoginAttempts}
              onChange={e => update("maxLoginAttempts", Number(e.target.value))}
            />
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              <h4>Change Admin Password</h4>
              <p>Update the admin account password</p>
            </SettingLabel>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <InputField
                type={showPassword ? "text" : "password"} $w="200px"
                placeholder="New password"
                value={settings.adminPassword}
                onChange={e => update("adminPassword", e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 8, padding: '0.5rem', cursor: 'pointer', color: '#94a3b8',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </SettingRow>
        </Section>

        {/* Bottom save */}
        <Flex justify="flex-end" style={{ marginTop: '1rem' }}>
          <SaveBtn onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save All Settings"}
          </SaveBtn>
        </Flex>
      </PageBody>
    </Wrapper>
  );
};

export default AdminSettings;
