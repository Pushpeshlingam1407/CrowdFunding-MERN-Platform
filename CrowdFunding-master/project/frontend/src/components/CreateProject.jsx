import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  DollarSign, 
  Calendar, 
  CheckCircle2,
  FileText,
  ShieldCheck,
  Target
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid, Input } from './ui';
import { projectAPI } from '../services/api';

const CreateWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const Stepper = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  items: center;
  gap: 0.5rem;
  opacity: ${props => props.active ? 1 : 0.4};
  transition: all 0.3s;
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? props.theme.colors.primary : '#eee'};
  color: ${props => props.active ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FormSection = styled(motion.div)`
  max-width: 700px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #444;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  background: white;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  min-height: 150px;
  margin-bottom: 1.5rem;
  resize: vertical;
`;

const CreateProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    targetAmount: '',
    equity: '',
    startDate: '',
    endDate: '',
    image: null
  });
  const [campaignImages, setCampaignImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCampaignImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setCampaignImages(prev => [...prev, ...files]);
  };

  const removeCampaignImage = (index) => {
    setCampaignImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key]);
    });

    try {
      const response = await projectAPI.createProject(payload);
      const projectId = response.data.project._id;
      
      // Upload campaign images if any
      if (campaignImages.length > 0) {
        const imagePayload = new FormData();
        campaignImages.forEach(file => {
          imagePayload.append('images', file);
        });
        await projectAPI.uploadCampaignImages(projectId, imagePayload);
      }
      
      toast.success('Campaign launched successfully! Awaiting verification.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to launch campaign');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <CreateWrapper>
      <Container>
        <Stepper>
          <StepItem active={currentStep >= 1}>
            <StepCircle active={currentStep >= 1}>1</StepCircle>
            <StepLabel>Identity</StepLabel>
          </StepItem>
          <StepItem active={currentStep >= 2}>
            <StepCircle active={currentStep >= 2}>2</StepCircle>
            <StepLabel>Strategy</StepLabel>
          </StepItem>
          <StepItem active={currentStep >= 3}>
            <StepCircle active={currentStep >= 3}>3</StepCircle>
            <StepLabel>Cover</StepLabel>
          </StepItem>
          <StepItem active={currentStep >= 4}>
            <StepCircle active={currentStep >= 4}>4</StepCircle>
            <StepLabel>Gallery</StepLabel>
          </StepItem>
        </Stepper>

        <FormSection
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card style={{ padding: '3rem' }}>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Project Identity</h2>
                  <p style={{ color: '#666', marginBottom: '2.5rem' }}>Define the core vision of your B2B venture.</p>
                  
                  <Label>Campaign Title</Label>
                  <Input 
                    name="title" 
                    placeholder="e.g. Next-Gen AI Logistics" 
                    value={formData.title} 
                    onChange={handleChange}
                    style={{ marginBottom: '1.5rem' }}
                    required
                  />

                  <Label>Detailed Vision</Label>
                  <TextArea 
                    name="description" 
                    placeholder="What problem are you solving for the ecosystem?" 
                    value={formData.description} 
                    onChange={handleChange}
                    required
                  />

                  <Label>Category</Label>
                  <Select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                  </Select>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Funding Strategy</h2>
                  <p style={{ color: '#666', marginBottom: '2.5rem' }}>Set your financial goals and timeline.</p>
                  
                  <Grid cols={2} gap="1.5rem">
                    <div>
                      <Label>Target Amount (₹)</Label>
                      <Input 
                        type="number" 
                        name="targetAmount" 
                        placeholder="5,000,000" 
                        value={formData.targetAmount} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>Equity Offered (%)</Label>
                      <Input 
                        type="number" 
                        name="equity" 
                        placeholder="10" 
                        value={formData.equity} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Grid>

                  <Grid cols={2} gap="1.5rem" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <Label>Launch Date</Label>
                      <Input 
                        type="date" 
                        name="startDate" 
                        value={formData.startDate} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>Expiration Date</Label>
                      <Input 
                        type="date" 
                        name="endDate" 
                        value={formData.endDate} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Grid>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Cover Image</h2>
                  <p style={{ color: '#666', marginBottom: '2.5rem' }}>Upload your campaign cover image that will be displayed prominently.</p>
                  
                  <div style={{ padding: '3rem', border: '2px dashed #eee', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem' }}>
                    <Upload size={32} style={{ color: '#0077b6', marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>
                      {formData.image ? `✓ ${formData.image.name}` : 'Upload Campaign Cover Image'}
                    </p>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      onChange={handleChange} 
                      style={{ marginTop: '1rem' }} 
                      required
                    />
                  </div>

                  <Flex gap="1rem" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                     <ShieldCheck size={20} style={{ color: '#2f855a' }} />
                     <span style={{ fontSize: '0.85rem', color: '#666' }}>Your data is protected by StartupFund's enterprise security protocols.</span>
                  </Flex>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Campaign Gallery</h2>
                  <p style={{ color: '#666', marginBottom: '2.5rem' }}>Upload additional images to showcase your campaign (optional). Upload up to 10 images.</p>
                  
                  <div style={{ padding: '3rem', border: '2px dashed #eee', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem' }}>
                    <Upload size={32} style={{ color: '#0077b6', marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>
                      {campaignImages.length > 0 
                        ? `✓ ${campaignImages.length} image(s) selected` 
                        : 'Upload Campaign Gallery Images'}
                    </p>
                    <input 
                      type="file" 
                      name="campaignImages" 
                      accept="image/*" 
                      onChange={handleCampaignImagesChange} 
                      style={{ marginTop: '1rem' }}
                      multiple
                    />
                  </div>

                  {campaignImages.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>Selected Images:</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                        {campaignImages.map((file, index) => (
                          <div 
                            key={index}
                            style={{
                              position: 'relative',
                              paddingBottom: '100%',
                              background: '#f0f0f0',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '1px solid #ddd'
                            }}
                          >
                            <img 
                              src={URL.createObjectURL(file)}
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
                              onClick={() => removeCampaignImage(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255, 0, 0, 0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '16px',
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
                    </div>
                  )}

                  <Flex gap="1rem" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                     <ShieldCheck size={20} style={{ color: '#2f855a' }} />
                     <span style={{ fontSize: '0.85rem', color: '#666' }}>Gallery images are optional. You can add them later from your dashboard.</span>
                  </Flex>
                </>
              )}

              <Flex gap="1rem" style={{ marginTop: '3rem' }}>
                {currentStep > 1 && <Button variant="outline" type="button" onClick={prevStep} style={{ flexGrow: 1 }}>Back</Button>}
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep} style={{ flexGrow: 2 }}>
                    Continue <ArrowRight size={18} style={{ marginLeft: 8 }} />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} style={{ flexGrow: 2 }}>
                    {loading ? 'Launching...' : 'Launch B2B Campaign'} <Rocket size={18} style={{ marginLeft: 8 }} />
                  </Button>
                )}
              </Flex>
            </form>
          </Card>
        </FormSection>
      </Container>
    </CreateWrapper>
  );
};

export default CreateProject;
