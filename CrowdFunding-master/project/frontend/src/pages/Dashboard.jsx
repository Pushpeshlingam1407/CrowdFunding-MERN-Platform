import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Plus, 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings, 
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid } from '../components/ui';
import DocumentUpload from '../components/ui/DocumentUpload';
import useAuthStore from '../store/authStore';
import api, { projectAPI, chatAPI, b2bAPI } from '../services/api';


const DashboardWrapper = styled.div`
  padding: 3rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const Sidebar = styled.aside`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f0f0f0;
  position: sticky;
  top: 100px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: ${props => props.active ? props.theme.colors.primary : '#666'};
  background: ${props => props.active ? `${props.theme.colors.primary}10` : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;

  &:hover {
    background: ${props => props.theme.colors.primary}05;
    color: ${props => props.theme.colors.primary};
  }
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  
  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th {
    text-align: left;
    padding: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
  }

  td {
    padding: 1.25rem 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch(props.status) {
      case 'active': case 'approved': return '#e6fffa';
      case 'pending': return '#fffaf0';
      case 'rejected': return '#fff5f5';
      default: return '#f7fafc';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'active': case 'approved': return '#047481';
      case 'pending': return '#b7791f';
      case 'rejected': return '#c53030';
      default: return '#4a5568';
    }
  }};
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getUserProjects();
      setProjects(response.data);
      const total = response.data.length;
      const active = response.data.filter(p => p.status === 'approved' || p.status === 'active').length;
      const pending = response.data.filter(p => p.status === 'pending').length;
      setStats({ total, active, pending });
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectAPI.deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'campaigns':
        return (
          <Card>
            <Flex justify="space-between" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Management Dashboard</h2>
                <Button size="sm" onClick={() => navigate('/projects/new')}>+ New Campaign</Button>
            </Flex>
            <TableWrapper>
                <table>
                  <thead>
                    <tr>
                      <th>CAMPAIGN NAME</th>
                      <th>CATEGORY</th>
                      <th>TARGET</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project._id}>
                        <td style={{ fontWeight: 600 }}>{project.title}</td>
                        <td>{project.category}</td>
                        <td>₹{project.targetAmount?.toLocaleString()}</td>
                        <td>
                          <StatusBadge status={project.status}>{project.status}</StatusBadge>
                        </td>
                        <td>
                          <Flex gap="0.5rem">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}`)}>
                              <ExternalLink size={14} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}/edit`)}>
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              style={{ color: '#e53e3e', borderColor: '#fed7d7' }}
                              onClick={() => handleDelete(project._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
          </Card>
        );
      case 'documents':
        return (
          <Card style={{ padding: '2.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Professional Records</h2>
             <DocumentUpload />
          </Card>
        );
      case 'messages':
        return (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
             <MessageSquare size={48} style={{ color: '#0077b6', marginBottom: '1.5rem', opacity: 0.3 }} />
             <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Secure Messaging Space</h3>
             <p style={{ color: '#666', marginBottom: '2rem' }}>Connect with startups, professional investors and MNCS in a secure, isolated B2B environment.</p>
             <Button onClick={() => navigate('/messages')}>Go to Private Space</Button>
          </Card>
        );
      default:
        return (
          <>
            <Grid cols={3} gap="1.5rem" style={{ marginBottom: '2.5rem' }}>
              <StatCard>
                <div className="icon-box" style={{ background: '#0077b615', color: '#0077b6' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.total}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Projects</p>
                </div>
              </StatCard>
              <StatCard>
                <div className="icon-box" style={{ background: '#c6f6d5', color: '#2f855a' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.active}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Active Approved</p>
                </div>
              </StatCard>
              <StatCard>
                <div className="icon-box" style={{ background: '#feebc8', color: '#c05621' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.pending}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Pending Review</p>
                </div>
              </StatCard>
            </Grid>

            <Card>
              <Flex justify="space-between" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Campaigns</h2>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('campaigns')}>View All</Button>
              </Flex>
              
              <TableWrapper>
                <table>
                  <thead>
                    <tr>
                      <th>CAMPAIGN NAME</th>
                      <th>CATEGORY</th>
                      <th>TARGET</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 5).map(project => (
                      <tr key={project._id}>
                        <td style={{ fontWeight: 600 }}>{project.title}</td>
                        <td>{project.category}</td>
                        <td>₹{project.targetAmount?.toLocaleString()}</td>
                        <td>
                          <StatusBadge status={project.status}>{project.status}</StatusBadge>
                        </td>
                        <td>
                          <Flex gap="0.5rem">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}`)}>
                              <ExternalLink size={14} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}/edit`)}>
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              style={{ color: '#e53e3e', borderColor: '#fed7d7' }}
                              onClick={() => handleDelete(project._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                          No campaigns found. Start by creating one!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TableWrapper>
            </Card>
          </>
        );
    }
  };


  return (
    <DashboardWrapper>
      <Container>
        <Grid cols="1fr 3fr" gap="2rem">
          <Sidebar>
            <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={20} /> Overview
            </NavItem>
            <NavItem active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')}>
              <Briefcase size={20} /> My Campaigns
            </NavItem>
            <NavItem active={activeTab === 'messages'} onClick={() => setActiveTab('messages')}>
              <MessageSquare size={20} /> Private Space
            </NavItem>
            <NavItem active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
              <FileText size={20} /> Documents
            </NavItem>
            <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
              <Settings size={20} /> Settings
            </NavItem>
          </Sidebar>

          <main>
            <header style={{ marginBottom: '2.5rem' }}>
              <Flex justify="space-between">
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px' }}>
                    Welcome back, {user?.name.split(' ')[0]}!
                  </h1>
                  <p style={{ color: '#666' }}>Here's an overview of your B2B activities.</p>
                </div>
                <Button onClick={() => navigate('/projects/new')}>
                  <Plus size={18} style={{ marginRight: 8 }} /> Create Campaign
                </Button>
              </Flex>
            </header>

            {renderContent()}
          </main>
        </Grid>
      </Container>
    </DashboardWrapper>
  );
};

export default Dashboard;