import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [userProjects, setUserProjects] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's projects
        const projectsResponse = await fetch(`/api/projects/user/${user.id}`);
        const projectsData = await projectsResponse.json();
        setUserProjects(projectsData);

        // Fetch user's donations
        const donationsResponse = await fetch(`/api/donations/user/${user.id}`);
        const donationsData = await donationsResponse.json();
        setUserDonations(donationsData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return <div>Please login to view your dashboard</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
          {userProjects.length === 0 ? (
            <p>No projects created yet.</p>
          ) : (
            <div className="space-y-4">
              {userProjects.map((project) => (
                <div key={project.id} className="border p-4 rounded-lg">
                  <h3 className="text-xl font-medium">{project.title}</h3>
                  <p className="text-gray-600">Status: {project.status}</p>
                  <p className="text-gray-600">
                    Raised: ₹{project.raisedAmount} / ₹{project.targetAmount}
                  </p>
                  <Link
                    to={`/project/${project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">My Donations</h2>
          {userDonations.length === 0 ? (
            <p>No donations made yet.</p>
          ) : (
            <div className="space-y-4">
              {userDonations.map((donation) => (
                <div key={donation.id} className="border p-4 rounded-lg">
                  <h3 className="text-xl font-medium">
                    {donation.project.title}
                  </h3>
                  <p className="text-gray-600">
                    Amount: ₹{donation.amount}
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/project/${donation.project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Project
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 