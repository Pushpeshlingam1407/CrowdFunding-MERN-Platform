import React, { useState } from "react";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Building2,
  Globe,
  ShieldCheck,
  Save,
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Container, Flex, Grid, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { userAPI, b2bAPI } from "../services/api";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    companyName: user?.companyName || "",
    companyWebsite: user?.companyWebsite || "",
    bio: user?.bio || "",
    logo: "",
    slogan: "",
    portfolio: [],
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [companyData, setCompanyData] = useState(null);

  React.useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const res = await b2bAPI.getCompany(user.id);
      setCompanyData(res.data);
      setFormData((prev) => ({
        ...prev,
        logo: res.data.branding?.logo || "",
        slogan: res.data.branding?.slogan || "",
        portfolio: res.data.portfolio || [],
      }));
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords if changing
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New passwords do not match");
          setLoading(false);
          return;
        }
      }

      const updateData = {
        name: formData.name,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        bio: formData.bio,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }

      const response = await userAPI.updateProfile(updateData);

      // Update Company Data
      await b2bAPI.updateCompany(companyData?.id || user?.id, {
        branding: {
          logo: formData.logo,
          slogan: formData.slogan,
        },
        portfolio: formData.portfolio,
      });

      updateUser(response.data.user);
      toast.success("Professional journey and profile updated!");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      fetchCompanyData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioItem = () => {
    setFormData({
      ...formData,
      portfolio: [
        ...formData.portfolio,
        { title: "", description: "", link: "", image: "" },
      ],
    });
  };

  const removePortfolioItem = (index) => {
    const newPortfolio = formData.portfolio.filter((_, i) => i !== index);
    setFormData({ ...formData, portfolio: newPortfolio });
  };

  const updatePortfolioItem = (index, field, value) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setFormData({ ...formData, portfolio: newPortfolio });
  };

  return (
    <div className="profile-wrapper">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="profile-card">
            <header className="profile-header">
              <div className="profile-avatar">{user?.name.charAt(0)}</div>
              <h1 className="profile-title">Professional Identity</h1>
              <p className="text-muted">
                Manage your personal and company metadata for the crowdfunding
                ecosystem.
              </p>
            </header>

            <form onSubmit={handleSubmit}>
              <h3 className="profile-section-title">
                <User size={20} /> Personal Information
              </h3>
              <Grid cols={2} gap="1.5rem">
                <div>
                  <label className="profile-label">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="profile-label">
                    Email Address (Locked)
                  </label>
                  <Input
                    value={user?.email}
                    disabled
                    className="profile-input-locked"
                  />
                </div>
              </Grid>

              <h3 className="profile-section-title">
                <Building2 size={20} /> Company Profile
              </h3>
              <Grid cols={2} gap="1.5rem">
                <div>
                  <label className="profile-label">Entity / Company Name</label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Innovations"
                  />
                </div>
                <div>
                  <label className="profile-label">Official Website</label>
                  <Input
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://acme.io"
                  />
                </div>
              </Grid>
              <div className="profile-bio-container">
                <label className="profile-label">Company Bio / Vision</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Describe your company's role in the ecosystem..."
                  className="textarea-field"
                />
              </div>

              <h3 className="profile-section-title">
                <Globe size={20} /> Branding & Visibility
              </h3>
              <Grid cols={2} gap="1.5rem">
                <div>
                  <label className="profile-label">Company Logo URL</label>
                  <Input
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://path-to-logo.png"
                  />
                </div>
                <div>
                  <label className="profile-label">
                    Core Slogan / Mission Statement
                  </label>
                  <Input
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleChange}
                    placeholder="e.g. Revolutionizing the industry"
                  />
                </div>
              </Grid>

              <h3 className="profile-section-title">
                <Briefcase size={20} /> Portfolio & Legit Works
              </h3>
              <p className="text-muted profile-portfolio-desc">
                Showcase your past projects and successful collaborations.
              </p>

              {formData.portfolio.map((item, index) => (
                <Card key={index} className="profile-portfolio-card">
                  <Flex
                    justify="space-between"
                    className="profile-portfolio-header"
                  >
                    <h4 className="profile-portfolio-title">
                      Project #{index + 1}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => removePortfolioItem(index)}
                      className="profile-portfolio-delete-btn"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Flex>
                  <Grid cols={2} gap="1rem">
                    <div>
                      <label className="profile-label">Project Title</label>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updatePortfolioItem(index, "title", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="profile-label">Project Link</label>
                      <Input
                        value={item.link}
                        onChange={(e) =>
                          updatePortfolioItem(index, "link", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </Grid>
                  <div className="profile-portfolio-input-spacing">
                    <label className="profile-label">Description of Work</label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updatePortfolioItem(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </Card>
              ))}

              <Button
                variant="outline"
                type="button"
                onClick={addPortfolioItem}
                className="btn-full"
              >
                <Plus size={18} className="icon-mr" /> Add Portfolio Item
              </Button>

              <h3 className="profile-section-title">
                <Lock size={20} /> Security Update
              </h3>
              <Grid cols={3} gap="1rem">
                <div>
                  <label className="profile-label">Current Passphrase</label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="profile-label">New Passphrase</label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="profile-label">Confirm New</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </Grid>

              <Button
                size="lg"
                className="btn-full profile-save-btn"
                disabled={loading}
              >
                <Save size={18} className="icon-mr" />
                {loading ? "Saving Identity..." : "Update Ecosystem Profile"}
              </Button>
            </form>

            <Flex gap="1rem" className="security-info-box profile-security-box">
              <ShieldCheck size={20} className="security-icon" />
              <span className="security-text">
                Your information is verified and secured using industry-standard
                crowdfunding protocols.
              </span>
            </Flex>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default Profile;
