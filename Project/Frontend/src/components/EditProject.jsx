import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Trash2,
  Upload,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { projectAPI } from "../services/api";
import { Button, Card, Container, Flex, Grid, Input } from "./ui";

const EditWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const FormSection = styled(motion.div)`
  max-width: 820px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #444;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  background: white;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  min-height: 150px;
  margin-bottom: 1.5rem;
  resize: vertical;
`;

const LockBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 12px;
  color: #b45309;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Environment",
  "Finance",
  "Social",
  "Other",
];

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [campaignImages, setCampaignImages] = useState([]);
  const [newCampaignImages, setNewCampaignImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technology",
    targetAmount: "",
    equity: "",
    startDate: "",
    endDate: "",
    image: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await projectAPI.getProject(id);
        const p = res.data;
        setIsLocked(p.isLocked || false);
        setCampaignImages(p.campaignImages || []);
        setFormData({
          title: p.title || "",
          description: p.description || "",
          category: p.category || "Technology",
          targetAmount: p.targetAmount || "",
          equity: p.equity || "",
          startDate: p.startDate?.split("T")[0] || "",
          endDate: p.endDate?.split("T")[0] || "",
          image: p.image || null,
        });
        if (p.image && typeof p.image === "string") {
          setImagePreview(p.image?.startsWith('http') ? p.image : `http://localhost:5000${p.image}`);
        }
      } catch {
        toast.error("Failed to load campaign");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "newImage" && files?.[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (name === "campaignImages" && files) {
      setNewCampaignImages((prev) => [...prev, ...Array.from(files)]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteCampaignImage = async (imageUrl) => {
    try {
      setUploadingImages(true);
      await projectAPI.deleteCampaignImage(id, imageUrl);
      setCampaignImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleUploadNewCampaignImages = async () => {
    if (newCampaignImages.length === 0) {
      toast.info("No new images to upload");
      return;
    }

    try {
      setUploadingImages(true);
      const imagePayload = new FormData();
      newCampaignImages.forEach((file) => {
        imagePayload.append("images", file);
      });
      const response = await projectAPI.uploadCampaignImages(id, imagePayload);
      setCampaignImages(response.data.campaignImages);
      setNewCampaignImages([]);
      toast.success("Campaign images uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeNewCampaignImage = (index) => {
    setNewCampaignImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("This campaign is locked and cannot be edited.");
      return;
    }
    setSaving(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      // Skip existing image URL string (only upload if it's a File object)
      if (key === "image" && typeof val === "string") return;
      if (key === "image" && val instanceof File) {
        payload.append("image", val);
        return;
      }
      if (val !== null && val !== undefined) {
        payload.append(key, val);
      }
    });

    try {
      await projectAPI.updateProject(id, payload);
      toast.success("🎉 Campaign updated successfully!");
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EditWrapper>
        <div style={{ textAlign: "center", paddingTop: "4rem", color: "#666" }}>
          Loading campaign…
        </div>
      </EditWrapper>
    );
  }

  return (
    <EditWrapper>
      <Container>
        <FormSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${id}`)}
            style={{ marginBottom: "2rem", padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} style={{ marginRight: 8 }} /> Cancel Editing
          </Button>

          <Card style={{ padding: "3rem" }}>
            <Flex justify="space-between" align="flex-start" style={{ marginBottom: "2.5rem" }}>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-1px" }}>
                  Edit Campaign
                </h2>
                <p style={{ color: "#666" }}>
                  Update your venture details and funding strategy.
                </p>
              </div>
              <Button 
                variant="outline" 
                style={{ color: "#e53e3e", borderColor: "#fed7d7" }}
                onClick={() => toast.info("Delete from the dashboard")}
              >
                <Trash2 size={16} style={{ marginRight: 8 }} /> Delete
              </Button>
            </Flex>

            {isLocked && (
              <LockBanner>
                <AlertTriangle size={18} />
                This campaign has expired and is locked. Editing is disabled.
              </LockBanner>
            )}

            <form onSubmit={handleSubmit}>
              <Label>Campaign Title *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. GreenTech Solar Solutions"
                style={{ marginBottom: "1.5rem" }}
                required
                disabled={isLocked}
              />

              <Label>Project Vision *</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your startup, problem, and solution…"
                required
                disabled={isLocked}
              />

              <Grid cols={2} gap="1.5rem">
                <div>
                  <Label>Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isLocked}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Equity Offered (%)</Label>
                  <Input
                    type="number"
                    name="equity"
                    value={formData.equity}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    min="0"
                    max="100"
                    style={{ marginBottom: "1.5rem" }}
                    required
                    disabled={isLocked}
                  />
                </div>
              </Grid>

              <Grid cols={2} gap="1.5rem">
                <div>
                  <Label>Funding Goal (₹)</Label>
                  <Input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="e.g. 5000000"
                    style={{ marginBottom: "1.5rem" }}
                    required
                    disabled={isLocked}
                  />
                </div>
                <div>
                  <Label>Campaign End Date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    style={{ marginBottom: "1.5rem" }}
                    required
                    disabled={isLocked}
                  />
                </div>
              </Grid>

              {/* Cover Image Upload */}
              <div style={{ marginTop: "1rem", marginBottom: "2.5rem" }}>
                <Label>Hero Image</Label>
                {imagePreview ? (
                  <div style={{ position: "relative", width: "100%", height: "300px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {!isLocked && (
                      <div style={{ position: "absolute", bottom: "1rem", right: "1rem", background: "white", borderRadius: "8px", padding: "0.5rem 1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                        <label style={{ cursor: "pointer", margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0077b6" }}>
                          Change Cover Image
                          <input type="file" name="newImage" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: "3rem", border: "2px dashed #eee", borderRadius: "16px", textAlign: "center", background: "#fafafa" }}>
                    <Upload size={32} style={{ color: "#0077b6", marginBottom: "1rem" }} />
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#444" }}>Upload Campaign Cover Image</p>
                    <input type="file" name="newImage" accept="image/*" onChange={handleChange} disabled={isLocked} style={{ marginTop: "1rem" }} />
                  </div>
                )}
              </div>

              {/* Campaign Gallery */}
              <div style={{ marginBottom: "3rem" }}>
                <Label>Campaign Gallery</Label>
                
                {campaignImages.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
                      Existing Gallery Images ({campaignImages.length}):
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
                      {campaignImages.map((imgUrl, index) => (
                        <div key={index} style={{ position: "relative", paddingBottom: "100%", background: "#f0f0f0", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
                          <img src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:5000${imgUrl}`} alt={`Gallery ${index + 1}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaignImage(imgUrl)}
                            disabled={uploadingImages || isLocked}
                            style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(255,0,0,0.8)", color: "white", border: "none", borderRadius: "4px", width: "24px", height: "24px", cursor: (uploadingImages || isLocked) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ padding: "3rem", border: "2px dashed #eee", borderRadius: "16px", textAlign: "center", background: "#fafafa" }}>
                  <Upload size={32} style={{ color: "#0077b6", marginBottom: "1rem" }} />
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#444" }}>
                    {newCampaignImages.length > 0 ? `✓ ${newCampaignImages.length} new image(s) selected` : "Upload Additional Gallery Images"}
                  </p>
                  <input type="file" name="campaignImages" accept="image/*" onChange={handleChange} disabled={isLocked} multiple style={{ marginTop: "1rem" }} />
                </div>

                {newCampaignImages.length > 0 && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                      {newCampaignImages.map((file, index) => (
                        <div key={index} style={{ position: "relative", paddingBottom: "100%", background: "#f0f0f0", borderRadius: "8px", overflow: "hidden", border: "2px solid #0077b6" }}>
                          <img src={URL.createObjectURL(file)} alt={`New Gallery ${index + 1}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          <button type="button" onClick={() => removeNewCampaignImage(index)} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(255,0,0,0.8)", color: "white", border: "none", borderRadius: "4px", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={handleUploadNewCampaignImages}
                      disabled={uploadingImages || isLocked}
                      style={{ width: "100%", padding: "1rem" }}
                    >
                      {uploadingImages ? "Uploading..." : "Upload New Gallery Images Now"}
                    </Button>
                  </>
                )}
              </div>

              <Button
                type="submit"
                disabled={saving || isLocked}
                style={{ width: "100%", padding: "1.2rem", fontSize: "1.1rem" }}
              >
                {saving ? "Saving Changes..." : "Save & Publish Updates"} <Save size={18} style={{ marginLeft: 8 }} />
              </Button>
            </form>
          </Card>
        </FormSection>
      </Container>
    </EditWrapper>
  );
};

export default EditProject;
