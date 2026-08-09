import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Info } from "lucide-react";
import { Button } from "./ui";
import "./InvestmentModal.css";

const InvestmentModal = ({ isOpen, onClose, project, onProceed }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !project) return null;

  const calculateEquity = () => {
    const val = (project.equity * Number(amount)) / project.targetAmount || 0;
    return val.toFixed(4);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 10000) {
      setError("Minimum investment is ₹10,000");
      return;
    }

    if (Number(amount) > 10000000) {
      setError("Maximum investment limit is ₹1,00,00,000");
      return;
    }

    setError("");
    setLoading(true);
    onProceed(Number(amount));
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>Invest in {project.title}</h2>
          <p>
            Secure your equity position in this campaign. Minimum investment is
            ₹10,000.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Investment Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              min="10000"
              step="1000"
              className={`investment-input ${error ? "input-error" : ""}`}
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="modal-equity-info">
            <div>
              <span>Estimated Equity</span>
              <span>{calculateEquity()}%</span>
            </div>
            <div>
              <span>Current Valuation</span>
              <span>
                ₹
                {Math.round(
                  (project.targetAmount * 100) / project.equity,
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="modal-info-box">
            <Info size={20} />
            <p>
              Your funds will be held in a secure escrow account and only
              released if the campaign reaches its target. If unsuccessful, you
              will receive a full refund.
            </p>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="btn-flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-flex-1"
              disabled={loading || !amount || Number(amount) < 10000}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default InvestmentModal;
