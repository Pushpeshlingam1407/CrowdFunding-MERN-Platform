import React, { useState } from "react";

const CreateProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const [campaignImages, setCampaignImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "startDate") {
      const start = new Date(value);
      if (!isNaN(start.getTime())) {
        const futureDate = new Date(start);
        futureDate.setDate(start.getDate() + 30);
        const formattedEndDate = futureDate.toISOString().split("T")[0];
        setFormData({
          ...formData,
          startDate: value,
          endDate: formattedEndDate,
        });
      } else {
        setFormData({ ...formData, startDate: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCampaignImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setCampaignImages((prev) => [...prev, ...files]);
  };

  const removeCampaignImage = (index) => {
    setCampaignImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });

    try {
      const response = await projectAPI.createProject(payload);
      const projectId = response.data.project._id;

      // Upload campaign images if any
      if (campaignImages.length > 0) {
        const imagePayload = new FormData();
        campaignImages.forEach((file) => {
          imagePayload.append("images", file);
        });
        await projectAPI.uploadCampaignImages(projectId, imagePayload);
      }

      toast.success("Campaign launched successfully! Awaiting verification.");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to launch campaign");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim() || formData.title.trim().length < 5) {
        toast.error("Campaign title must be at least 5 characters long");
        return;
      }
      if (
        !formData.description.trim() ||
        formData.description.trim().length < 20
      ) {
        toast.error("Venture description must be at least 20 characters long");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.targetAmount || Number(formData.targetAmount) < 1000) {
        toast.error("Target funding amount must be at least ₹1,000");
        return;
      }
      if (
        !formData.equity ||
        Number(formData.equity) <= 0 ||
        Number(formData.equity) > 100
      ) {
        toast.error("Equity offered must be between 0.1% and 100%");
        return;
      }
      if (!formData.startDate) {
        toast.error("Please specify a launch date");
        return;
      }
      if (!formData.endDate) {
        toast.error("Please specify an expiration date");
        return;
      }
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast.error("Expiration date must be after the launch date");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.image) {
        toast.error("Please upload a cover image for your campaign");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="create-wrapper">
      <Container>
        <div className="create-stepper">
          {[
            { num: 1, label: "Basics" },
            { num: 2, label: "Financials" },
            { num: 3, label: "Media" },
            { num: 4, label: "Review" },
          ].map((s) => (
            <div
              key={s.num}
              className={`create-step-item ${currentStep >= s.num ? "active" : ""}`}
            >
              <div
                className={`create-step-circle ${currentStep >= s.num ? "active" : ""}`}
              >
                {currentStep > s.num ? <CheckCircle2 size={20} /> : s.num}
              </div>
              <span className="create-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                className="create-form-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="step-title">Project Identity</h2>
                <p className="step-subtitle">
                  Define the core vision of your venture.
                </p>
                <div className="input-spacing">
                  <label className="create-label">Campaign Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. NextGen AI Infrastructure"
                    required
                  />
                </div>

                <div className="input-spacing">
                  <label className="create-label">Short Description</label>
                  <textarea
                    className="create-textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the problem you're solving and your solution..."
                    required
                  />
                </div>

                <div className="input-spacing">
                  <label className="create-label">Industry Category</label>
                  <select
                    className="create-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Flex justify="flex-end" className="form-actions">
                  <Button type="button" onClick={() => setCurrentStep(2)}>
                    Continue <ArrowRight size={18} className="icon-ml" />
                  </Button>
                </Flex>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                className="create-form-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="step-title">Funding Strategy</h2>
                <p className="step-subtitle">
                  Set your financial goals and timeline.
                </p>

                <Grid cols="1fr 1fr" gap="1.5rem" className="input-spacing">
                  <div>
                    <label className="create-label">Funding Target (USD)</label>
                    <Input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      placeholder="e.g. 500000"
                      min="1000"
                      required
                    />
                  </div>
                  <div>
                    <label className="create-label">Equity Offered (%)</label>
                    <Input
                      type="number"
                      name="equity"
                      value={formData.equity}
                      onChange={handleChange}
                      placeholder="e.g. 15"
                      min="0.1"
                      max="100"
                      step="0.1"
                      required
                    />
                  </div>
                </Grid>

                <div className="input-spacing">
                  <label className="create-label">Campaign Timeline</label>
                  <Grid cols="1fr 1fr" gap="1.5rem">
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate}
                      required
                    />
                  </Grid>
                </div>

                <Flex gap="1rem" className="form-actions">
                  <Button variant="outline" type="button" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setCurrentStep(3)}>
                    Continue
                  </Button>
                </Flex>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                className="create-form-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="step-title">Cover Image</h2>
                <ImageUpload
                  value={formData.image}
                  onChange={(file) => setFormData({ ...formData, image: file })}
                  onRemove={() => setFormData({ ...formData, image: null })}
                  maxSizeMB={5}
                />
                <Flex gap="1rem" className="form-actions">
                  <Button variant="outline" type="button" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setCurrentStep(4)}>
                    Continue
                  </Button>
                </Flex>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                className="create-form-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="step-title">Campaign Gallery</h2>
                <ImageUpload
                  value={campaignImages}
                  multiple={true}
                  onChange={(files) =>
                    setCampaignImages((prev) => [...prev, ...files])
                  }
                  onRemove={(index) =>
                    setCampaignImages((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  maxSizeMB={5}
                />
                <Flex gap="1rem" className="form-actions">
                  <Button variant="outline" type="button" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-flex-2"
                  >
                    {loading ? "Launching..." : "Launch Campaign"}{" "}
                    <Rocket size={18} className="icon-ml" />
                  </Button>
                </Flex>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Container>
    </div>
  );
};

export default CreateProject;
