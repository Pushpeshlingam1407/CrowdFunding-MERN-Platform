import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const AdminDataContext = createContext();

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
};

export const AdminDataProvider = ({ children }) => {
  const { adminAuthenticated } = useAuth();

  const [stats, setStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  const getBaseURL = () =>
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const fetchAllData = useCallback(
    async (force = false) => {
      // Prevent fetching if not authenticated or if we fetched recently (unless forced)
      if (!adminAuthenticated) return;
      if (!force && lastFetched && Date.now() - lastFetched < 60000) return; // 1 minute cache

      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, invRes, projRes, usersRes] = await Promise.all([
          fetch(`${getBaseURL()}/admin/dashboard`, { headers }),
          fetch(`${getBaseURL()}/admin/investments`, { headers }),
          fetch(`${getBaseURL()}/admin/projects`, { headers }),
          fetch(`${getBaseURL()}/admin/users`, { headers }),
        ]);

        const [statsData, invData, projData, usersData] = await Promise.all([
          statsRes.json(),
          invRes.json(),
          projRes.json(),
          usersRes.json(),
        ]);

        if (statsData.success) {
          setStats({
            users: statsData.stats.totalUsers,
            revenue: statsData.stats.totalInvestedAmount,
            campaigns: statsData.stats.totalProjects,
            totalInvestments: statsData.stats.totalInvestments,
          });
        }

        if (invData.success) {
          setInvestments(invData.investments || []);
        }

        if (projData.success || projData.projects) {
          setProjects(
            Array.isArray(projData.projects) ? projData.projects : [],
          );
        }

        if (usersData.success || usersData.users) {
          setUsers(Array.isArray(usersData.users) ? usersData.users : []);
        }

        setLastFetched(Date.now());
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        toast.error("Failed to sync live data");
      } finally {
        setLoading(false);
      }
    },
    [adminAuthenticated, lastFetched],
  );

  useEffect(() => {
    if (adminAuthenticated) {
      fetchAllData();
    }
  }, [adminAuthenticated, fetchAllData]);

  const value = {
    stats,
    investments,
    projects,
    users,
    loading,
    refreshData: () => fetchAllData(true),
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
