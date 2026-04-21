import React, { useState } from 'react';
import styled from 'styled-components';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Flex, Grid } from './ui';

const Wrapper = styled.div`
  max-width: 600px;
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.hasFile ? props.theme.colors.primary : '#e0e0e0'};
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  background: ${props => props.hasFile ? `${props.theme.colors.primary}05` : '#fafafa'};
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}05;
  }

  input[type='file'] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background: white;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
`;

const ErrorBox = styled.div`
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 10px;
  padding: 0.9rem 1.25rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  color: #c53030;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const SuccessBox = styled.div`
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 10px;
  padding: 0.9rem 1.25rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  color: #276749;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f0f7ff;
  border: 1px solid #bee3f8;
  border-radius: 10px;
  padding: 0.9rem 1.25rem;
  margin-bottom: 1.5rem;
  
  .name {
    font-weight: 600;
    font-size: 0.9rem;
    flex-grow: 1;
    word-break: break-all;
  }
  .size {
    font-size: 0.8rem;
    color: #888;
    white-space: nowrap;
  }
`;

const DocumentUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setError('');
    setSuccess('');
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(selected.type)) {
      setError('Only PDF, JPEG and PNG files are allowed.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('File size must be under 5 MB.');
      return;
    }
    setFile(selected);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) { setError('Please select a file.'); return; }
    if (!documentType) { setError('Please select a document type.'); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (projectName) formData.append('projectName', projectName);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      setSuccess(`Document "${file.name}" uploaded successfully!`);
      setFile(null);
      setDocumentType('');
      setProjectName('');
      toast.success('Document uploaded successfully!');
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError('');
  };

  return (
    <Wrapper>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Document</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
        Upload identity, financial, or project documents for KYC verification. Accepted: PDF, JPEG, PNG (max 5 MB).
      </p>

      {error && (
        <ErrorBox>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          {error}
        </ErrorBox>
      )}
      {success && (
        <SuccessBox>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          {success}
        </SuccessBox>
      )}

      <form onSubmit={handleSubmit}>
        {/* Drop Zone */}
        <DropZone hasFile={!!file}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Upload size={32} style={{ color: '#0077b6', marginBottom: '1rem', opacity: file ? 1 : 0.5 }} />
          <p style={{ fontWeight: 600, color: '#444', marginBottom: '0.25rem' }}>
            {file ? file.name : 'Drag & drop or click to select a file'}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            {file ? formatSize(file.size) : 'PDF, JPEG, PNG · Max 5 MB'}
          </p>
        </DropZone>

        {/* Selected file pill */}
        {file && (
          <FileInfo>
            <FileText size={20} color="#0077b6" style={{ flexShrink: 0 }} />
            <span className="name">{file.name}</span>
            <span className="size">{formatSize(file.size)}</span>
            <button
              type="button"
              onClick={clearFile}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}
            >
              <X size={16} />
            </button>
          </FileInfo>
        )}

        {/* Document Type */}
        <Label>Document Type *</Label>
        <Select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          required
        >
          <option value="">Select document type…</option>
          <option value="identity">Identity Proof (Aadhaar, PAN, Passport)</option>
          <option value="address">Address Proof</option>
          <option value="financial">Financial Statement</option>
          <option value="project">Project Document</option>
          <option value="other">Other</option>
        </Select>

        {/* Project Name (optional context) */}
        <Label>Related Project Name (optional)</Label>
        <InputField
          type="text"
          placeholder="e.g. My Startup Campaign"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <Button
          type="submit"
          size="lg"
          style={{ width: '100%' }}
          disabled={loading || !file || !documentType}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </form>
    </Wrapper>
  );
};

export default DocumentUpload;