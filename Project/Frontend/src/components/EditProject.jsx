import React, { useState, useEffect } from "react";

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
          setImagePreview(
            p.image?.startsWith("http")
              ? p.image
              : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://localhost:5000"}${p.image}`,
          );
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
        <div className="edit-loading">Loading campaign…</div>
      </EditWrapper>
    );
  }

  return (
    <div className="edit-wrapper">
      <Container>
        <motion.div
          className="edit-form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${id}`)}
            className="btn-cancel-edit"
          >
            <ArrowLeft size={16} className="icon-mr" /> Cancel Editing
          </Button>

          <Card className="form-card">
            <Flex
              justify="space-between"
              align="flex-start"
              className="edit-header-flex"
            >
              <div>
                <h2 className="step-title">Edit Campaign</h2>
                <p className="step-subtitle-no-mb">
                  Update your venture details and funding strategy.
                </p>
              </div>
              <Button
                variant="outline"
                className="btn-outline-danger"
                onClick={() => toast.info("Delete from the dashboard")}
              >
                <Trash2 size={16} className="icon-mr" /> Delete
              </Button>
            </Flex>

            {isLocked && (
              <div className="edit-lock-banner">
                <AlertTriangle size={20} />
                <span>
                  Some fields are locked because this campaign has already
                  received funding or verification.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-spacing">
                <label className="edit-label">Campaign Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. NextGen AI Infrastructure"
                  required
                />
              </div>

              <div className="input-spacing">
                <label className="edit-label">Detailed Vision</label>
                <textarea
                  className="edit-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <Grid cols="1fr 1fr" gap="1.5rem" className="input-spacing">
                <div>
                  <label className="edit-label">Industry Category</label>
                  <select
                    className="edit-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="edit-label">Status</label>
                  <select
                    className="edit-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="active">Active (Public)</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </Grid>

              <Grid cols="1fr 1fr" gap="1.5rem" className="input-spacing">
                <div>
                  <label className="edit-label">Funding Target (USD)</label>
                  <Input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="edit-label">Campaign End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input-spacing"
                    required
                    disabled={isLocked}
                  />
                </div>
              </Grid>

              <div className="hero-image-upload">
                <label className="edit-label">Cover Image</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(file) =>
                    setFormData((prev) => ({ ...prev, image: file }))
                  }
                  onRemove={() =>
                    setFormData((prev) => ({ ...prev, image: null }))
                  }
                  disabled={isLocked}
                  maxSizeMB={5}
                />
              </div>

              {/* Campaign Gallery */}
              <div className="gallery-upload">
                <label className="edit-label">Campaign Gallery</label>
                <ImageUpload
                  value={newCampaignImages}
                  existingImages={campaignImages}
                  multiple={true}
                  onChange={(files) =>
                    setNewCampaignImages((prev) => [...prev, ...files])
                  }
                  onRemove={(index) =>
                    setNewCampaignImages((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  onDeleteExisting={handleDeleteCampaignImage}
                  disabled={isLocked}
                  maxSizeMB={5}
                />

                {newCampaignImages.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleUploadNewCampaignImages}
                    disabled={uploadingImages || isLocked}
                    className="btn-upload-gallery"
                  >
                    {uploadingImages
                      ? "Uploading..."
                      : "Upload New Gallery Images Now"}
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                disabled={saving || isLocked}
                className="btn-save-publish"
              >
                {saving ? "Saving Changes..." : "Save & Publish Updates"}{" "}
                <Save size={18} className="icon-ml" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default EditProject;
