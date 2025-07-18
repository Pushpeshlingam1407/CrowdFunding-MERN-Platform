import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DocumentUpload = ({ show, onHide, userType }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile?.type)) {
      setError('Only PDF, JPEG, and PNG files are allowed');
      setFile(null);
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile?.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!documentType) {
      setError('Please select a document type');
      return;
    }

    if (userType === 'creator' && !projectName) {
      setError('Please enter a project name');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (projectName) {
      formData.append('projectName', projectName);
    }

    try {
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      toast.success('Document uploaded successfully');
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setDocumentType('');
    setProjectName('');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Document Type</Form.Label>
            <Form.Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
            >
              <option value="">Select document type</option>
              <option value="identity">Identity Proof</option>
              <option value="address">Address Proof</option>
              <option value="financial">Financial Statement</option>
              <option value="project">Project Document</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          {userType === 'creator' && (
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            <Form.Text className="text-muted">
              Supported formats: PDF, JPEG, PNG (Max size: 5MB)
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DocumentUpload; 