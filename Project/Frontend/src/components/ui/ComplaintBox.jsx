import React, { useState } from "react";

const ComplaintBox = ({ isOpen, onClose, targetCompanyId }) => {
  const [formData, setFormData] = useState({
    type: "bug",
    subject: "",
    description: "",
    screenshot: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await b2bAPI.postComplaint({ ...formData, targetCompanyId });
      toast.success("Your report has been submitted to the compliance team.");
      onClose();
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="complaint-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Card
            className="complaint-form-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="complaint-close-btn" onClick={onClose}>
              <X size={20} />
            </button>

            <header className="complaint-header">
              <Flex gap="0.75rem" className="complaint-header-row">
                <ShieldAlert size={24} className="complaint-icon" />
                <h2 className="complaint-title">Compliance Report</h2>
              </Flex>
              <p className="complaint-description">
                Flagging a company for fraud, bugs, or unpaid services ensures a
                safe community.
              </p>
            </header>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Report Type</label>
              <select
                className="complaint-select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="bug">Technical Bug / Interface Error</option>
                <option value="fraud">Fraud / Scam Suspicion</option>
                <option value="unpaid">Unpaid / Unsettled Service</option>
                <option value="other">Other Compliance Issue</option>
              </select>

              <label className="form-label">Subject</label>
              <Input
                placeholder="Brief summary of the issue"
                className="complaint-input-spacing"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />

              <label className="form-label">Detailed Description</label>
              <textarea
                className="complaint-textarea"
                placeholder="Provide as much detail as possible to help our team investigate..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <label className="form-label">
                Proof / Screenshot (Optional)
              </label>
              <UploadBox>
                <Camera size={24} className="complaint-camera-icon" />
                <p className="complaint-upload-text">
                  Click to upload screenshot
                </p>
              </UploadBox>

              <Button
                type="submit"
                className="btn-danger-submit"
                disabled={loading}
              >
                <Send size={18} className="icon-mr" />
                {loading ? "Submitting..." : "Flag as Fraud / Bug"}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComplaintBox;
