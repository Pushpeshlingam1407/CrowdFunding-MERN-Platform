import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  ArrowLeft,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { projectAPI } from '../services/api';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
// ─────────────────────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #060b17 0%, #0d1526 60%, #0a1020 100%);
  padding: 5rem 1rem 4rem;
`;

const FormCard = styled(motion.div)`
  max-width: 820px;
  margin: 0 auto;
  background: rgba(14, 22, 40, 0.9);
  border: 1px solid #1e293b;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #1e293b;
  color: #64748b;
  padding: 0.5rem 1.1rem;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: #38bdf8;
    color: #38bdf8;
  }
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #f8fafc;
  margin-bottom: 0.4rem;

  span {
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const SubText = styled.p`
  color: #475569;
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
`;

const Divider = styled.div`
  height: 1px;
  background: #1e293b;
  margin: 2rem 0;
`;

const Label = styled.label`
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.85rem 1.1rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &::placeholder { color: #334155; }
  &:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.08);
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1.1rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.95rem;
  outline: none;
  min-height: 140px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &::placeholder { color: #334155; }
  &:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.08);
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.85rem 1.1rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus { border-color: #38bdf8; }
  option { background: #0f172a; }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FieldGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ImageUploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem;
  border: 2px dashed #1e293b;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: #0a1020;
  text-align: center;

  &:hover {
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.03);
  }

  input { display: none; }
`;

const SaveBtn = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
  color: #050d1a;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 2.5rem;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 9px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: transparent;
  color: #f87171;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: rgba(248, 113, 113, 0.08); }
`;

const LockBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  color: #fbbf24;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const CATEGORIES = ['Technology', 'Healthcare', 'Education', 'Environment', 'Finance', 'Social', 'Other'];

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
    title: '',
    description: '',
    category: 'Technology',
    targetAmount: '',
    equity: '',
    startDate: '',
    endDate: '',
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
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'Technology',
          targetAmount: p.targetAmount || '',
          equity: p.equity || '',
          startDate: p.startDate?.split('T')[0] || '',
          endDate: p.endDate?.split('T')[0] || '',
          image: p.image || null,
        });
        if (p.image && typeof p.image === 'string') {
          setImagePreview(`http://localhost:5000${p.image}`);
        }
      } catch {
        toast.error('Failed to load campaign');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'newImage' && files?.[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (name === 'campaignImages' && files) {
      setNewCampaignImages(prev => [...prev, ...Array.from(files)]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteCampaignImage = async (imageUrl) => {
    try {
      setUploadingImages(true);
      await projectAPI.deleteCampaignImage(id, imageUrl);
      setCampaignImages(prev => prev.filter(img => img !== imageUrl));
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleUploadNewCampaignImages = async () => {
    if (newCampaignImages.length === 0) {
      toast.info('No new images to upload');
      return;
    }

    try {
      setUploadingImages(true);
      const imagePayload = new FormData();
      newCampaignImages.forEach(file => {
        imagePayload.append('images', file);
      });
      const response = await projectAPI.uploadCampaignImages(id, imagePayload);
      setCampaignImages(response.data.campaignImages);
      setNewCampaignImages([]);
      toast.success('Campaign images uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeNewCampaignImage = (index) => {
    setNewCampaignImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error('This campaign is locked and cannot be edited.');
      return;
    }
    setSaving(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      // Skip existing image URL string (only upload if it's a File object)
      if (key === 'image' && typeof val === 'string') return;
      if (key === 'image' && val instanceof File) {
        payload.append('image', val);
        return;
      }
      if (val !== null && val !== undefined) {
        payload.append(key, val);
      }
    });

    try {
      await projectAPI.updateProject(id, payload);
      toast.success('🎉 Campaign updated successfully!');
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div style={{
          maxWidth: 820, margin: '0 auto', display: 'flex',
          flexDirection: 'column', gap: '1rem', alignItems: 'center',
          paddingTop: '4rem', color: '#475569',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid #1e293b', borderTopColor: '#38bdf8',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '0.9rem' }}>Loading campaign…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <BackBtn onClick={() => navigate(`/projects/${id}`)}>
          <ArrowLeft size={15} /> Cancel Editing
        </BackBtn>

        <FormCard
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
            <div>
              <Heading>
                Edit <span>Campaign</span>
              </Heading>
              <SubText>Update your venture details and funding strategy.</SubText>
            </div>
            <DeleteBtn onClick={() => toast.info('Delete from the dashboard')}>
              <Trash2 size={14} /> Delete
            </DeleteBtn>
          </div>

          {isLocked && (
            <LockBanner>
              <AlertTriangle size={18} />
              This campaign has expired and is locked. Editing is disabled.
            </LockBanner>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <FieldGroup>
              <Label>Campaign Title *</Label>
              <StyledInput
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. GreenTech Solar Solutions"
                required
                disabled={isLocked}
              />
            </FieldGroup>

            {/* Description */}
            <FieldGroup>
              <Label>Project Vision *</Label>
              <StyledTextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your startup, problem, and solution…"
                required
                disabled={isLocked}
              />
            </FieldGroup>

            <Divider />

            {/* Category + Equity */}
            <TwoCol>
              <FieldGroup>
                <Label>Category</Label>
                <StyledSelect name="category" value={formData.category} onChange={handleChange} disabled={isLocked}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </StyledSelect>
              </FieldGroup>
              <FieldGroup>
                <Label>Equity Offered (%)</Label>
                <StyledInput
                  type="number"
                  name="equity"
                  value={formData.equity}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="0"
                  max="100"
                  required
                  disabled={isLocked}
                />
              </FieldGroup>
            </TwoCol>

            {/* Target + End Date */}
            <TwoCol>
              <FieldGroup>
                <Label>Funding Goal (₹)</Label>
                <StyledInput
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="e.g. 5000000"
                  required
                  disabled={isLocked}
                />
              </FieldGroup>
              <FieldGroup>
                <Label>Campaign End Date</Label>
                <StyledInput
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  disabled={isLocked}
                />
              </FieldGroup>
            </TwoCol>

            <Divider />

            {/* Image Upload */}
            <FieldGroup>
              <Label>Hero Image</Label>
              <ImageUploadZone>
                <input
                  type="file"
                  name="newImage"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={isLocked}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }}
                  />
                ) : (
                  <>
                    <ImageIcon size={32} style={{ color: '#334155' }} />
                    <p style={{ color: '#475569', fontSize: '0.85rem' }}>Click to upload a new hero image</p>
                    <p style={{ color: '#1e293b', fontSize: '0.75rem' }}>PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
              </ImageUploadZone>
              {imagePreview && (
                <p style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.5rem', textAlign: 'center' }}>
                  ✓ Image selected — will replace existing on save
                </p>
              )}
            </FieldGroup>

            <Divider />

            {/* Campaign Gallery */}
            <FieldGroup>
              <Label>Campaign Gallery</Label>
              {campaignImages.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>Existing Gallery Images ({campaignImages.length}):</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {campaignImages.map((imageUrl, index) => (
                      <div 
                        key={index}
                        style={{
                          position: 'relative',
                          paddingBottom: '100%',
                          background: '#0f172a',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #1e293b'
                        }}
                      >
                        <img 
                          src={`http://localhost:5000${imageUrl}`}
                          alt={`Gallery ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaignImage(imageUrl)}
                          disabled={uploadingImages}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(248, 113, 113, 0.8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            cursor: uploadingImages ? 'not-allowed' : 'pointer',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: uploadingImages ? 0.6 : 1
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ImageUploadZone>
                <input
                  type="file"
                  name="campaignImages"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={isLocked}
                  multiple
                />
                <Upload size={24} style={{ color: '#334155' }} />
                <p style={{ color: '#475569', fontSize: '0.85rem' }}>
                  {newCampaignImages.length > 0 
                    ? `✓ ${newCampaignImages.length} new image(s) selected` 
                    : 'Click to add more gallery images'}
                </p>
                <p style={{ color: '#1e293b', fontSize: '0.75rem' }}>Up to 10 images, PNG/JPG/WEBP</p>
              </ImageUploadZone>

              {newCampaignImages.length > 0 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                    {newCampaignImages.map((file, index) => (
                      <div 
                        key={index}
                        style={{
                          position: 'relative',
                          paddingBottom: '100%',
                          background: '#0f172a',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid #38bdf8'
                        }}
                      >
                        <img 
                          src={URL.createObjectURL(file)}
                          alt={`New Gallery ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeNewCampaignImage(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(248, 113, 113, 0.8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    type="button"
                    onClick={handleUploadNewCampaignImages}
                    disabled={uploadingImages}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: uploadingImages ? '#475569' : '#38bdf8',
                      color: '#050d1a',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: uploadingImages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    whileHover={{ scale: uploadingImages ? 1 : 1.01 }}
                  >
                    {uploadingImages ? (
                      <>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(5,13,26,0.3)', borderTopColor: '#050d1a', animation: 'spin 0.7s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Gallery Images
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </FieldGroup>

            {/* Submit */}
            <SaveBtn
              type="submit"
              disabled={saving || isLocked}
              whileHover={{ scale: isLocked ? 1 : 1.01 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
            >
              {saving ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(5,13,26,0.3)', borderTopColor: '#050d1a', animation: 'spin 0.7s linear infinite' }} />
                  Saving Changes…
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save &amp; Publish Updates
                </>
              )}
            </SaveBtn>
          </form>
        </FormCard>
      </div>
    </PageWrapper>
  );
};

export default EditProject;