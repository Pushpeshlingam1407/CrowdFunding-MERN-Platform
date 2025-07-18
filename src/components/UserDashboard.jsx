import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [userProjects, setUserProjects] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [projectsRes, paymentsRes] = await Promise.all([
          axios.get('/api/projects/user'),
          axios.get('/api/payments/history')
        ]);

        setUserProjects(projectsRes.data);
        setInvestments(paymentsRes.data);
      } catch (error) {
        toast.error('Error fetching dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>My Dashboard</h1>
      
      <section className="dashboard-section">
        <h2>My Projects</h2>
        {userProjects.length === 0 ? (
          <p>You haven't created any projects yet.</p>
        ) : (
          <div className="projects-grid">
            {userProjects.map(project => (
              <div key={project._id} className="project-card">
                <img src={project.image} alt={project.title} />
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p className="status">Status: {project.status}</p>
                  <p className="funding">
                    Raised: ${project.currentFunding.toLocaleString()}
                  </p>
                  <Link to={`/projects/${project._id}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Link to="/create-project" className="create-button">
          Create New Project
        </Link>
      </section>

      <section className="dashboard-section">
        <h2>My Investments</h2>
        {investments.length === 0 ? (
          <p>You haven't made any investments yet.</p>
        ) : (
          <div className="investments-list">
            {investments.map(payment => (
              <div key={payment._id} className="investment-item">
                <img 
                  src={payment.project.image} 
                  alt={payment.project.title} 
                  className="project-thumbnail"
                />
                <div className="investment-details">
                  <h3>{payment.project.title}</h3>
                  <p className="amount">
                    Amount: ${payment.amount.toLocaleString()}
                  </p>
                  <p className="date">
                    Date: {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link 
                  to={`/projects/${payment.project._id}`}
                  className="view-button"
                >
                  View Project
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard; 