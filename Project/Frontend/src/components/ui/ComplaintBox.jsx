import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  Send,
  Camera,
  Bug,
  ShieldAlert,
  ShieldClose,
  FileWarning,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Card, Flex, Input } from "./index";
import { b2bAPI } from "../../services/api";
import "./ComplaintBox.css";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const FormCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #333;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 0.95rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 120px;
  resize: vertical;
`;

const UploadBox = styled.div`
  border: 2px dashed #e0e0e0;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #888;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}05;
  }
`;

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
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <FormCard
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>

            <header className="complaint-header">
              <Flex gap="0.75rem" className="complaint-header-row">
                <ShieldAlert size={24} className="complaint-icon" />
                <h2 className="complaint-title">
                  Compliance Report
                </h2>
              </Flex>
              <p className="complaint-description">
                Flagging a company for fraud, bugs, or unpaid services ensures a
                safe community.
              </p>
            </header>

            <form onSubmit={handleSubmit}>
              <label className="form-label">
                Report Type
              </label>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="bug">Technical Bug / Interface Error</option>
                <option value="fraud">Fraud / Scam Suspicion</option>
                <option value="unpaid">Unpaid / Unsettled Service</option>
                <option value="other">Other Compliance Issue</option>
              </Select>

              <label className="form-label">
                Subject
              </label>
              <Input
                placeholder="Brief summary of the issue"
                className="complaint-input-spacing"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />

              <label className="form-label">
                Detailed Description
              </label>
              <TextArea
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
          </FormCard>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ComplaintBox;
