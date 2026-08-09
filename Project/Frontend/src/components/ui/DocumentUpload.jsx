import React, { useState } from "react";

/* ─── Component ──────────────────────── */
const DocumentUpload = ({ onUploadSuccess }) => {
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [projName, setProjName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fmt = (b) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    validateAndSetFile(f);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    validateAndSetFile(f);
  };

  const validateAndSetFile = (f) => {
    setError("");
    setSuccess("");
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(f.type)) {
      setError("Only PDF, JPEG, PNG, DOC or DOCX files allowed.");
      return;
    }
    if (f.size > 9 * 1024 * 1024) {
      setError("File must be under 9 MB.");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!docType) {
      setError("Please select a document type.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("documentType", docType);
    if (projName) form.append("projectName", projName);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setSuccess(`"${file.name}" uploaded and pending verification.`);
      toast.success("Document uploaded successfully!");
      setFile(null);
      setDocType("");
      setProjName("");
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="doc-upload-heading">Secure Document Portal</h3>
      <p className="doc-upload-description">
        Upload KYC, financial statements, or project documents. Accepted: PDF,
        JPEG, PNG, DOC (max 9 MB).
      </p>

      {error && (
        <div className="doc-alert error">
          <AlertCircle size={18} className="icon-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="doc-alert success">
          <CheckCircle2 size={18} className="icon-shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFile}
          className="hidden-input"
        />

        {!file ? (
          <div
            className={`doc-drop-zone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload size={32} color="#6e6e73" />
            <p className="doc-upload-dropzone-text">
              {isDragging ? "Drop here" : "Click to browse or drag & drop"}
            </p>
            <p className="doc-upload-dropzone-subtext">
              {file ? fmt(file.size) : "PDF, JPEG, PNG, DOC/DOCX · Max 9 MB"}
            </p>
          </div>
        ) : null}

        {file && (
          <div className="doc-file-pill">
            <FileText size={20} color="#0071e3" className="icon-shrink-0" />
            <span className="name">{file.name}</span>
            <span className="size">{fmt(file.size)}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError("");
              }}
              className="clear-btn"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <label className="doc-label">Document Type *</label>
        <select
          className="doc-select"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          required
        >
          <option value="">Select document type…</option>
          <option value="identity">
            Identity Proof (Aadhaar / PAN / Passport)
          </option>
          <option value="address">Address Proof</option>
          <option value="financial">Financial Statement</option>
          <option value="project">Project Document</option>
          <option value="other">Other</option>
        </select>

        <label className="doc-label">Related Project (optional)</label>
        <input
          className="doc-text-input"
          type="text"
          placeholder="e.g. My Startup Campaign"
          value={projName}
          onChange={(e) => setProjName(e.target.value)}
        />

        <Button
          type="submit"
          size="lg"
          className="btn-full"
          disabled={loading || !file || !docType}
        >
          {loading ? "Uploading…" : "Upload Document"}
        </Button>
      </form>

      <Flex gap="1rem" className="doc-upload-security-box">
        <ShieldCheck size={20} className="security-icon" />
        <span className="doc-upload-security-text">
          Documents are encrypted and stored in compliance with our crowdfunding
          data isolation policies.
        </span>
      </Flex>
    </div>
  );
};

export default DocumentUpload;
