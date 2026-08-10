import React, { useState, useRef } from "react";

const PaymentModal = ({
  isOpen,
  onClose,
  project,
  amount,
  projectId,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'processing', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState("");

  // Form data for different payment methods
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiData, setUpiData] = useState({ upiId: "" });
  const [netBankingData, setNetBankingData] = useState({
    bankName: "",
    accountNumber: "",
  });

  if (!isOpen) return null;

  const paymentMethods = [
    { id: "credit-debit", label: "Credit/Debit Card", icon: "💳" },
    { id: "upi", label: "UPI", icon: "📱" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
    { id: "wallet", label: "Digital Wallet", icon: "👛" },
  ];

  const handlePaymentSubmit = async () => {
    if (!selectedMethod) {
      setStatus("error");
      setStatusMessage("Please select a payment method");
      return;
    }

    // Validate form data based on selected method
    if (selectedMethod === "credit-debit") {
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
        setStatus("error");
        setStatusMessage("Please fill in all card details");
        return;
      }
    } else if (selectedMethod === "upi") {
      if (!upiData.upiId) {
        setStatus("error");
        setStatusMessage("Please enter your UPI ID");
        return;
      }
    } else if (selectedMethod === "netbanking") {
      if (!netBankingData.bankName || !netBankingData.accountNumber) {
        setStatus("error");
        setStatusMessage("Please fill in all bank details");
        return;
      }
    }

    setLoading(true);
    setStatus("processing");
    setStatusMessage("Processing your payment...");

    try {
      // Create payment order
      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount,
            projectId,
            paymentMethod: selectedMethod,
            paymentDetails: {
              card: selectedMethod === "credit-debit" ? cardData : null,
              upi: selectedMethod === "upi" ? upiData : null,
              netbanking:
                selectedMethod === "netbanking" ? netBankingData : null,
            },
          }),
        },
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const { order } = await orderResponse.json();

      // For demo purposes, simulate successful payment
      // In production, this would integrate with Razorpay Checkout or a payment gateway
      setTimeout(async () => {
        try {
          // Verify payment
          const verifyResponse = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpayOrderId: order.id,
                razorpayPaymentId:
                  "pay_" + Math.random().toString(36).substr(2, 14),
                projectId,
                amount,
              }),
            },
          );

          if (verifyResponse.ok) {
            setStatus("success");
            setStatusMessage("Payment successful! Investment recorded.");
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);
          } else {
            throw new Error("Payment verification failed");
          }
        } catch (error) {
          setStatus("error");
          setStatusMessage(error.message || "Payment verification failed");
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.message || "Failed to process payment");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={status === "success" ? onClose : undefined}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {status !== "processing" && status !== "success" && (
              <button
                className="modal-close-btn"
                onClick={onClose}
                disabled={loading}
              >
                <X size={24} />
              </button>
            )}

            <div className="modal-header">
              <h2>Payment</h2>
              <p>Choose your payment method and complete the transaction</p>
            </div>

            <div className="amount-display">
              <p>Investment Amount</p>
              <h3>₹{Number(amount).toLocaleString()}</h3>
            </div>

            <AnimatePresence>
              {status && (
                <div className={`status-box ${status}`}>
                  {status === "processing" && (
                    <Loader size={20} className="spin-animation" />
                  )}
                  {status === "success" && <Check size={20} />}
                  {status === "error" && <AlertCircle size={20} />}
                  <span>{statusMessage}</span>
                </div>
              )}
            </AnimatePresence>

            {!status || status === "error" ? (
              <>
                <div className="form-section">
                  <h3 className="payment-method-title">
                    Select Payment Method
                  </h3>
                  <div className="payment-methods-grid">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        className={`payment-method-btn ${selectedMethod === method.id ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedMethod(method.id);
                          setStatus(null);
                        }}
                        whileHover={{ y: -2 }}
                        disabled={loading}
                      >
                        <span className="payment-method-icon">
                          {method.icon}
                        </span>
                        <span>{method.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {selectedMethod === "credit-debit" && (
                  <motion.div
                    className="form-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          cardNumber: e.target.value
                            .replace(/\s/g, "")
                            .slice(0, 16),
                        })
                      }
                      maxLength="16"
                      className="input-payment-spacing"
                      disabled={loading}
                    />

                    <div className="form-grid cols-2">
                      <div>
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiryDate: e.target.value.slice(0, 5),
                            })
                          }
                          maxLength="5"
                          className="input-payment"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvv: e.target.value.slice(0, 3),
                            })
                          }
                          maxLength="3"
                          className="input-payment"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedMethod === "upi" && (
                  <motion.div
                    className="form-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="form-label">UPI ID</label>
                    <input
                      type="text"
                      placeholder="your.upi@bank"
                      value={upiData.upiId}
                      onChange={(e) => setUpiData({ upiId: e.target.value })}
                      className="input-payment"
                      disabled={loading}
                    />
                  </motion.div>
                )}

                {selectedMethod === "netbanking" && (
                  <motion.div
                    className="form-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      placeholder="ICICI Bank"
                      value={netBankingData.bankName}
                      onChange={(e) =>
                        setNetBankingData({
                          ...netBankingData,
                          bankName: e.target.value,
                        })
                      }
                      className="input-payment-spacing"
                      disabled={loading}
                    />
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={netBankingData.accountNumber}
                      onChange={(e) =>
                        setNetBankingData({
                          ...netBankingData,
                          accountNumber: e.target.value,
                        })
                      }
                      className="input-payment"
                      disabled={loading}
                    />
                  </motion.div>
                )}

                {selectedMethod === "wallet" && (
                  <motion.div
                    className="form-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="status-box info">
                      <AlertCircle size={20} />
                      <span>
                        Digital wallet payment will redirect to the provider's
                        app
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="modal-actions-payment">
                  <button
                    className="btn-outline btn-flex-1"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="btn-primary btn-flex-1"
                    disabled={loading || !selectedMethod}
                  >
                    {loading
                      ? "Processing..."
                      : `Pay ₹${Number(amount).toLocaleString()}`}
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
