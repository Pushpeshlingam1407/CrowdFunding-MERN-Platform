import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const token = localStorage.getItem("token");
    const authToken = adminToken || token;

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user");
      localStorage.removeItem("adminUser");
      const isAdminPage = window.location.pathname.startsWith("/admin");
      window.location.href = isAdminPage ? "/admin/login" : "/login";
    }
    return Promise.reject(error);
  },
);

// API endpoints
export const projectAPI = {
  createProject: (data) =>
    api.post("/projects", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getProjects: () => api.get("/projects"),
  getProject: (id) => api.get(`/projects/${id}`),
  getUserProjects: () => api.get("/projects/user/projects"),
  updateProject: (id, data) =>
    api.put(`/projects/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  lockProject: (id) => api.post(`/projects/${id}/lock`),
  uploadCampaignImages: (id, data) =>
    api.post(`/projects/${id}/campaign-images`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteCampaignImage: (id, imageUrl) =>
    api.delete(`/projects/${id}/campaign-images`, { data: { imageUrl } }),
};

export const b2bAPI = {
  getCompanies: () => api.get("/companies"),
  getCompany: (id) => api.get(`/companies/${id}`),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  getReviews: (companyId) => api.get(`/reviews/company/${companyId}`),
  postReview: (data) => api.post("/reviews", data),
  postComplaint: (data) => api.post("/complaints", data),
};

export const chatAPI = {
  getMessages: (receiverId) => api.get(`/messages/${receiverId}`),
  sendMessage: (data) => api.post("/messages", data),
};

export const documentAPI = {
  uploadDocument: (data) => api.post("/documents/upload", data),
  getDocuments: (ownerId) => api.get(`/documents/owner/${ownerId}`),
};

export const userAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const investmentAPI = {
  createInvestment: (data) => api.post("/investments", data),
  getUserInvestments: () => api.get("/investments/user"),
  getProjectInvestments: (projectId) =>
    api.get(`/investments/project/${projectId}`),
};

export default api;
